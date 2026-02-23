import { useState, useCallback, useRef, useEffect } from "react";
import GameBoard, { PowerUp, PowerUpType } from "@/components/game/GameBoard";
import { startBackgroundMusic, stopBackgroundMusic, playGameOverSound } from "@/lib/sounds";

type GameState = "menu" | "playing" | "gameover";

const POWERUP_TYPES: PowerUpType[] = ["pesticide", "shield", "fertilizer"];
const POWERUP_SPAWN_INTERVAL = 12000; // every 12s
const POWERUP_LIFETIME = 10000; // expires after 10s
const SHIELD_DURATION = 5000;

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("corn-defender-high") || "0", 10);
  });
  const [difficulty, setDifficulty] = useState(1);
  const [gameKey, setGameKey] = useState(0);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [shieldActive, setShieldActive] = useState(false);
  const nextPuId = useRef(0);
  const shieldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = () => {
    setScore(0);
    setLives(5);
    setDifficulty(1);
    setGameKey(k => k + 1);
    setPowerUps([]);
    setShieldActive(false);
    setGameState("playing");
    startBackgroundMusic();
  };

  const handleGameOver = useCallback(() => {
    stopBackgroundMusic();
    playGameOverSound();
    setShieldActive(false);
    if (shieldTimer.current) clearTimeout(shieldTimer.current);
    setGameState("gameover");
    setHighScore(prev => {
      const newHigh = Math.max(prev, score);
      localStorage.setItem("corn-defender-high", String(newHigh));
      return newHigh;
    });
  }, [score]);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
    setDifficulty(1 + Math.floor(newScore / 50));
  }, []);

  // Spawn power-ups periodically
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
      const id = nextPuId.current++;
      setPowerUps(prev => {
        // Max 3 power-ups at a time
        const active = prev.filter(p => p.expiresAt > Date.now());
        if (active.length >= 3) return active;
        return [...active, { id, type, expiresAt: Date.now() + POWERUP_LIFETIME }];
      });
    }, POWERUP_SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState]);

  // Expire power-ups
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setPowerUps(prev => prev.filter(p => p.expiresAt > Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleUsePowerUp = useCallback((id: number) => {
    const pu = powerUps.find(p => p.id === id);
    setPowerUps(prev => prev.filter(p => p.id !== id));

    if (pu?.type === "shield") {
      setShieldActive(true);
      if (shieldTimer.current) clearTimeout(shieldTimer.current);
      shieldTimer.current = setTimeout(() => setShieldActive(false), SHIELD_DURATION);
    }
  }, [powerUps]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-grass/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="game-title text-4xl sm:text-5xl font-bold text-primary mb-1">
            🌽 Save the Corn! 🌽
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Squash the worms before they eat your crops!
          </p>
        </div>

        {/* Menu */}
        {gameState === "menu" && (
          <div className="flex flex-col items-center gap-6 bounce-in">
            <div className="text-7xl">🌽🐛</div>
            <p className="text-foreground/80 text-center max-w-xs font-body">
              Worms are attacking your corn field! Tap them quickly to protect your harvest.
            </p>
            <div className="flex gap-4 text-2xl">
              <span title="Pesticide - clears all worms">🧪</span>
              <span title="Shield - blocks damage">🛡️</span>
              <span title="Fertilizer - heals corn">💚</span>
            </div>
            <p className="text-muted-foreground text-xs font-body">Power-ups spawn during gameplay!</p>
            {highScore > 0 && (
              <p className="text-secondary font-display font-bold text-lg">
                🏆 Best: {highScore}
              </p>
            )}
            <button
              onClick={startGame}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-display text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              Start Game 🚀
            </button>
          </div>
        )}

        {/* Playing */}
        {gameState === "playing" && (
          <div>
            {/* HUD */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="font-display font-bold text-lg text-foreground">
                ⭐ {score}
              </div>
              <div className="font-display font-bold text-lg text-foreground">
                {"❤️".repeat(Math.max(0, lives))}{"🖤".repeat(Math.max(0, 5 - lives))}
              </div>
            </div>

            <GameBoard
              key={gameKey}
              onScoreChange={handleScoreChange}
              onLivesChange={setLives}
              onGameOver={handleGameOver}
              isPlaying={gameState === "playing"}
              difficulty={difficulty}
              powerUps={powerUps}
              onUsePowerUp={handleUsePowerUp}
              shieldActive={shieldActive}
            />

            <div className="text-center mt-3">
              <span className="text-xs text-muted-foreground font-body">
                Level {difficulty}
              </span>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameState === "gameover" && (
          <div className="flex flex-col items-center gap-5 bounce-in">
            <div className="text-6xl">😵</div>
            <h2 className="font-display text-3xl font-bold text-accent">Game Over!</h2>
            <div className="bg-card rounded-2xl p-6 shadow-lg text-center border border-border">
              <p className="font-display text-4xl font-bold text-secondary mb-2">{score}</p>
              <p className="text-muted-foreground font-body text-sm">points scored</p>
              {score >= highScore && score > 0 && (
                <p className="text-accent font-display font-bold mt-2">🎉 New High Score!</p>
              )}
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-display text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              Play Again 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
