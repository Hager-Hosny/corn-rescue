import { useState, useCallback } from "react";
import GameBoard from "@/components/game/GameBoard";

type GameState = "menu" | "playing" | "gameover";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("corn-defender-high") || "0", 10);
  });
  const [difficulty, setDifficulty] = useState(1);
  const [gameKey, setGameKey] = useState(0);

  const startGame = () => {
    setScore(0);
    setLives(5);
    setDifficulty(1);
    setGameKey(k => k + 1);
    setGameState("playing");
  };

  const handleGameOver = useCallback(() => {
    setGameState("gameover");
    setHighScore(prev => {
      const newHigh = Math.max(prev, score);
      localStorage.setItem("corn-defender-high", String(newHigh));
      return newHigh;
    });
  }, [score]);

  // Increase difficulty over time
  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
    setDifficulty(1 + Math.floor(newScore / 50));
  }, []);

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
