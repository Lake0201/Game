import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

interface GameProps {
  gameInstance: Phaser.Game;
}

const GameCanvas: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      // The Phaser game will be attached here
    }
  }, []);

  return (
    <div
      ref={gameRef}
      id="game-container"
      style={{
        width: '800px',
        height: '600px',
        background: '#000',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}
    />
  );
};

export default GameCanvas;
