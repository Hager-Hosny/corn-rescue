import { useState, useEffect, useCallback, useRef } from "react";
import { playSquashSound, playDamageSound, playComboSound, playPowerUpSound, playShieldSound } from "@/lib/sounds";

interface Worm {
  id: number;
  row: number;
  col: number;
  createdAt: number;
  squashed: boolean;
}

interface CornHealth {
  [key: string]: number;
}

export type PowerUpType = "pesticide" | "shield" | "fertilizer";

export interface PowerUp {
  id: number;
  type: PowerUpType;
  expiresAt: number;
}

interface GameBoardProps {
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
  onGameOver: () => void;
  isPlaying: boolean;
  difficulty: number;
  powerUps: PowerUp[];
  onUsePowerUp: (id: number) => void;
  shieldActive: boolean;
}

const GRID_ROWS = 3;
const GRID_COLS = 5;
const WORM_LIFETIME = 3000;

const POWERUP_INFO: Record<PowerUpType, { emoji: string; label: string }> = {
  pesticide: { emoji: "🧪", label: "Pesticide" },
  shield: { emoji: "🛡️", label: "Shield" },
  fertilizer: { emoji: "💚", label: "Fertilizer" },
};

const GameBoard = ({
  onScoreChange, onLivesChange, onGameOver, isPlaying, difficulty,
  powerUps, onUsePowerUp, shieldActive,
}: GameBoardProps) => {
  const [worms, setWorms] = useState<Worm[]>([]);
  const [cornHealth, setCornHealth] = useState<CornHealth>({});
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [combo, setCombo] = useState(0);
  const [flashClear, setFlashClear] = useState(false);
  const nextWormId = useRef(0);

  // Initialize corn health
  useEffect(() => {
    if (isPlaying) {
      const health: CornHealth = {};
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          health[`${r}-${c}`] = 3;
        }
      }
      setCornHealth(health);
      setWorms([]);
      setScore(0);
      setLives(5);
      setCombo(0);
    }
  }, [isPlaying]);

  useEffect(() => { onScoreChange(score); }, [score, onScoreChange]);
  useEffect(() => { onLivesChange(lives); }, [lives, onLivesChange]);

  // Spawn worms
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const aliveCells: string[] = [];
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          if ((cornHealth[`${r}-${c}`] ?? 3) > 0) {
            aliveCells.push(`${r}-${c}`);
          }
        }
      }
      if (aliveCells.length === 0) return;

      const cell = aliveCells[Math.floor(Math.random() * aliveCells.length)];
      const [row, col] = cell.split("-").map(Number);

      setWorms(prev => [...prev, {
        id: nextWormId.current++,
        row, col,
        createdAt: Date.now(),
        squashed: false,
      }]);
    }, Math.max(600, 1500 - difficulty * 100));

    return () => clearInterval(interval);
  }, [isPlaying, difficulty, cornHealth]);

  // Worm damage timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setWorms(prev => {
        const expired: Worm[] = [];
        const remaining = prev.filter(w => {
          if (w.squashed) return false;
          if (now - w.createdAt > WORM_LIFETIME) {
            expired.push(w);
            return false;
          }
          return true;
        });

        if (expired.length > 0 && !shieldActive) {
          playDamageSound();
          setCornHealth(ch => {
            const newHealth = { ...ch };
            expired.forEach(w => {
              const key = `${w.row}-${w.col}`;
              newHealth[key] = Math.max(0, (newHealth[key] ?? 3) - 1);
            });
            return newHealth;
          });
          setLives(l => {
            const newLives = l - expired.length;
            if (newLives <= 0) {
              setTimeout(onGameOver, 100);
            }
            return Math.max(0, newLives);
          });
          setCombo(0);
        }

        return remaining;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, onGameOver, shieldActive]);

  const squashWorm = useCallback((wormId: number) => {
    setWorms(prev => prev.map(w => w.id === wormId ? { ...w, squashed: true } : w));
    const newCombo = combo + 1;
    setCombo(newCombo);
    playSquashSound();
    if (newCombo > 1) playComboSound(newCombo);
    const points = 10 * Math.min(newCombo, 5);
    setScore(s => s + points);
  }, [combo]);

  // Power-up handlers
  const usePowerUp = useCallback((pu: PowerUp) => {
    onUsePowerUp(pu.id);

    if (pu.type === "pesticide") {
      playPowerUpSound();
      setWorms(prev => prev.map(w => ({ ...w, squashed: true })));
      setScore(s => s + worms.filter(w => !w.squashed).length * 5);
      setFlashClear(true);
      setTimeout(() => setFlashClear(false), 400);
    }

    if (pu.type === "shield") {
      playShieldSound();
      // Shield logic handled in parent via shieldActive prop
    }

    if (pu.type === "fertilizer") {
      playPowerUpSound();
      setCornHealth(ch => {
        const newHealth = { ...ch };
        // Find the most damaged corn and heal it
        let worstKey = "";
        let worstVal = 4;
        Object.entries(newHealth).forEach(([k, v]) => {
          if (v < worstVal && v > 0) { worstKey = k; worstVal = v; }
        });
        // Also try to revive dead corn
        if (!worstKey) {
          Object.entries(newHealth).forEach(([k, v]) => {
            if (v === 0 && !worstKey) { worstKey = k; worstVal = v; }
          });
        }
        if (worstKey) {
          newHealth[worstKey] = Math.min(3, (newHealth[worstKey] ?? 0) + 2);
        }
        return newHealth;
      });
    }
  }, [onUsePowerUp, worms]);

  const getCornEmoji = (health: number) => {
    if (health === 3) return "🌽";
    if (health === 2) return "🌾";
    if (health === 1) return "🌿";
    return "💀";
  };

  return (
    <div className="relative">
      {/* Shield overlay */}
      {shieldActive && (
        <div className="absolute -inset-2 rounded-2xl border-4 border-sky/60 bg-sky/10 z-20 pointer-events-none bounce-in">
          <div className="absolute top-1 right-2 text-xs font-display font-bold text-sky">
            🛡️ SHIELD
          </div>
        </div>
      )}

      {/* Flash clear effect */}
      {flashClear && (
        <div className="absolute inset-0 bg-corn-light/40 rounded-xl z-30 pointer-events-none bounce-in" />
      )}

      {/* Combo indicator */}
      {combo > 1 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-display text-accent font-bold text-lg bounce-in z-30">
          {combo}x Combo! 🔥
        </div>
      )}

      <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
        {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, idx) => {
          const row = Math.floor(idx / GRID_COLS);
          const col = idx % GRID_COLS;
          const key = `${row}-${col}`;
          const health = cornHealth[key] ?? 3;
          const cellWorms = worms.filter(w => w.row === row && w.col === col && !w.squashed);

          return (
            <div
              key={key}
              className="relative aspect-square rounded-xl bg-grass-light/30 border-2 border-grass/30 flex items-center justify-center overflow-hidden transition-colors"
              style={{ minWidth: 56 }}
            >
              <span className={`text-3xl sm:text-4xl select-none ${health > 0 ? "munch" : ""}`} style={health === 0 ? { filter: "grayscale(1)" } : {}}>
                {getCornEmoji(health)}
              </span>

              {cellWorms.map(w => (
                <button
                  key={w.id}
                  onClick={() => squashWorm(w.id)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 bounce-in hover:scale-110 transition-transform"
                  aria-label="Squash the worm!"
                >
                  <span className="text-3xl sm:text-4xl wiggle select-none drop-shadow-lg">
                    🐛
                  </span>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Power-up bar */}
      {powerUps.length > 0 && (
        <div className="flex gap-2 justify-center mt-4">
          {powerUps.map(pu => {
            const info = POWERUP_INFO[pu.type];
            return (
              <button
                key={pu.id}
                onClick={() => usePowerUp(pu)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border-2 border-secondary font-display font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform bounce-in cursor-pointer"
                aria-label={`Use ${info.label}`}
              >
                <span className="text-xl">{info.emoji}</span>
                <span className="text-foreground">{info.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
