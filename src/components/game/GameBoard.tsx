import { useState, useEffect, useCallback, useRef } from "react";
import { playSquashSound, playDamageSound, playComboSound } from "@/lib/sounds";

interface Worm {
  id: number;
  row: number;
  col: number;
  createdAt: number;
  squashed: boolean;
}

interface CornHealth {
  [key: string]: number; // "row-col" -> health (3 = full, 0 = eaten)
}

interface GameBoardProps {
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
  onGameOver: () => void;
  isPlaying: boolean;
  difficulty: number;
}

const GRID_ROWS = 3;
const GRID_COLS = 5;
const WORM_LIFETIME = 3000;
const CORN_EMOJIS = ["🌽", "🌾", "🌿", "💀"];

const GameBoard = ({ onScoreChange, onLivesChange, onGameOver, isPlaying, difficulty }: GameBoardProps) => {
  const [worms, setWorms] = useState<Worm[]>([]);
  const [cornHealth, setCornHealth] = useState<CornHealth>({});
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [combo, setCombo] = useState(0);
  const [splats, setSplats] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextWormId = useRef(0);
  const nextSplatId = useRef(0);

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

        if (expired.length > 0) {
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
  }, [isPlaying, onGameOver]);

  const squashWorm = useCallback((wormId: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setSplats(prev => [...prev, {
      id: nextSplatId.current++,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }]);
    setTimeout(() => {
      setSplats(prev => prev.filter(s => s.id !== nextSplatId.current - 1));
    }, 500);

    setWorms(prev => prev.map(w => w.id === wormId ? { ...w, squashed: true } : w));
    const newCombo = combo + 1;
    setCombo(newCombo);
    playSquashSound();
    if (newCombo > 1) playComboSound(newCombo);
    const points = 10 * Math.min(newCombo, 5);
    setScore(s => s + points);
  }, [combo]);

  const getCornEmoji = (health: number) => {
    if (health === 3) return "🌽";
    if (health === 2) return "🌾";
    if (health === 1) return "🌿";
    return "💀";
  };

  return (
    <div className="relative">
      {/* Combo indicator */}
      {combo > 1 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-display text-accent font-bold text-lg bounce-in">
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
              {/* Corn */}
              <span className={`text-3xl sm:text-4xl select-none ${health > 0 ? "munch" : ""}`} style={health === 0 ? { filter: "grayscale(1)" } : {}}>
                {getCornEmoji(health)}
              </span>

              {/* Worms */}
              {cellWorms.map(w => (
                <button
                  key={w.id}
                  onClick={(e) => squashWorm(w.id, e)}
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
    </div>
  );
};

export default GameBoard;
