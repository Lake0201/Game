import React from 'react';
import * as Phaser from 'phaser';
import { Canvas } from './components/game-canvas'; // We will create this component

/**
 * CORE GAME CONSTANTS
 */
export const GAME_CONFIG = {
  type: Phaser.Types.GameManager.PRODUCTION,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scene: [Scene_Boot, Scene_Menu, Scene_Game, Scene_GameOver],
  scene: [Scene_Boot, Scene_Menu, Scene_Game, Scene_GameOver],
  autoCenter: true,
  parent: 'game-container',
  camera: {
    name: 'cameras[default]',
    log: false,
  },
  sprites: {
    enabled: true,
  },
  scene: [Scene_Boot, Scene_Menu, Scene_Game, Scene_GameOver],
};

// Note: This will be initialized in the React Component to handle the DOM container.
