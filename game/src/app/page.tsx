import React, { useState, useRef, useEffect } from 'react';
import * as Phaser from 'phaser';
import GameScene from './GameScene';

const GameContainer: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const gameInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) {
      gameInstance.current = new Phaser.Game({
        type: Phaser.Types.GameManager.PRODUCTION,
        width: 800,
        height: 600,
        parent: 'game-container',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 800 },
            debug: false,
          },
        },
        scene: [GameScene],
        autoCenter: true,
        camera: {
          name: 'cameras[default]',
          log: false,
        },
      });
    }

    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
      }
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="relative">
        <div
          id="game-container"
          ref={gameRef}
          className="border-4 border-slate-700 rounded-lg shadow-2xl"
          style={{ width: '800px', height: '600px' }}
        />

        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
            <h1 className="text-6xl font-bold text-white mb-8">Retro Quest</h1>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-white text-black rounded-full text-xl font-bold hover:bg-slate-200 transition-colors"
            >
              START GAME
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 rounded-lg">
            <h1 className="text-6xl font-bold text-white mb-8">GAME OVER</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white text-black rounded-full text-xl font-bold hover:bg-slate-200 transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-slate-400 text-center">
        <p>Use Arrow Keys to move and Jump</p>
        <p>Collect coins and reach the goal!</p>
      </div>
    </div>
  );
};

export default GameContainer;
