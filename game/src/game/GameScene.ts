import Phaser from 'phaser';

/**
 * GameScene handles the core gameplay loop, physics, and entity interactions.
 * Features: Multiple levels, moving platforms, enemies, and a scoring system.
 */
export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private platforms!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Input.Keyboard.CursorKeys;
  private coins!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private level: number = 1;
  private goal: Phaser.GameObjects.Sprite;

  constructor() {
    super('GameScene');
  }

  preload() {
    /**
     * Procedurally generate textures to ensure the game is playable
     * without external assets.
     */
    this.createTexture('platform', 32, 32, 0x8B4513);
    this.createTexture('player', 32, 32, 0xEE0000);
    this.createTexture('enemy', 32, 32, 0x00FF00);
    this.createTexture('coin', 20, 20, 0xFFD700);
    this.createTexture('block', 32, 32, 0xAAAAAA);
    this.createTexture('goal', 40, 40, 0xFFFFFF);
  }

  create() {
    this.score = 0;
    this.level = 1;
    this.scoreText.setText(`Score: ${this.score}`);

    this.createScene(this.level);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
  }

  private createScene(level: number) {
    // Clear existing groups
    this.platforms.clear(true, true);
    this.coins.clear(true, true);
    this.enemies.clear(true, true);

    // Background
    this.add.rectangle(400, 300, 800, 600, 0x34495e);

    // Initialize groups
    this.platforms = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.enemies = this.physics.add.group();

    // Build specific level
    if (level === 1) {
      this.buildLevel1();
    } else if (level === 2) {
      this.buildLevel2();
    } else {
      this.buildLevel3();
    }

    // Player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setGravityY(800);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.player.setDepth(10);

    // Enemies
    this.spawnEnemies(level);

    // Coins
    this.spawnCoins(level);

    // Goal
    this.goal = this.physics.add.sprite(700, 100, 'goal');
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.goal, this.winLevel, null, this);
    this.goal.setDepth(5);
  }

  private buildLevel1() {
    // Ground
    this.platforms.create(400, 580, 'platform').setDisplaySize(800, 40).refresh();
    // Static platforms
    this.platforms.create(200, 450, 'platform').setDisplaySize(200, 20).refresh();
    this.platforms.create(600, 350, 'platform').setDisplaySize(200, 20).refresh();
    // Dynamic platform
    const moving = this.platforms.create(300, 400, 'platform').setDisplaySize(100, 20).refresh();
    this.tweens.add({
      targets: moving,
      x: 500,
      y: 400,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Power1'
    });
  }

  private buildLevel2() {
    this.platforms.create(400, 580, 'platform').setDisplaySize(800, 40).refresh();
    this.platforms.create(200, 450, 'platform').setDisplaySize(300, 20).refresh();
    this.platforms.create(600, 300, 'platform').setDisplaySize(300, 20).refresh();
  }

  private buildLevel3() {
    // Boss Arena
    this.platforms.create(400, 580, 'platform').setDisplaySize(800, 40).refresh();
    this.platforms.create(100, 400, 'platform').setDisplaySize(200, 20).refresh();
    this.platforms.create(500, 300, 'platform').setDisplaySize(200, 20).refresh();
    this.platforms.create(700, 200, 'platform').setDisplaySize(200, 20).refresh();
  }

  private spawnEnemies(level: number) {
    const count = level === 1 ? 2 : level === 2 ? 4 : 1;
    for (let i = 0; i < count; i++) {
      const enemy = this.enemies.create(200 + (i * 100), 400, 'enemy');
      enemy.setGravityY(0);
      enemy.setVelocityX(100);
      enemy.setDepth(4);
    }
    if (level === 3) {
      // The Boss
      const boss = this.enemies.create(600, 200, 'enemy');
      boss.setDepth(5);
      boss.setVelocityX(0);
    }
  }

  private spawnCoins(level: number) {
    const count = level === 1 ? 5 : level === 2 ? 10 : 15;
    for (let i = 0; i < count; i++) {
      const coin = this.coins.create(100 + (i * 40), 200 + (Math.random() * 200), 'coin');
      coin.setDepth(3);
    }
  }

  update() {
    const p = this.player;

    // Horizontal movement
    if (this.cursors.left.isDown) {
      p.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      p.setVelocityX(160);
    } else {
      p.setVelocityX(0);
    }

    // Jump
    if (this.cursors.up.isDown && p.body.touching.down) {
      p.setVelocityY(-550);
    }

    // Boundaries
    if (p.x < 0) p.x = 0;
    if (p.x > 760) p.x = 760;

    // Enemy Patrol
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.body.blocked.left) {
        enemy.setVelocityX(100);
      } else if (enemy.body.blocked.right) {
        enemy.setVelocityX(-100);
      }
    });
  }

  private handleCoinCollect(coin: Phaser.GameObjects.Sprite, player: Phaser.GameObjects.Sprite) {
    coin.disableBody(true, true);
    this.score += 100;
    this.scoreText.setText(`Score: ${this.score}`);
    this.cameras.main.shake(100, 0.01);
  }

  private handleEnemyCollision(player: Phaser.GameObjects.Sprite, enemy: Phaser.GameObjects.Sprite) {
    player.setVelocityY(-300);
    player.setVelocityX(-100);
    this.score = Math.max(0, this.score - 50);
    this.scoreText.setText(`Score: ${this.score}`);
    this.cameras.main.shake(200, 0.05);
    player.setPosition(100, 450);
  }

  private winLevel() {
    this.level++;
    if (this.level <= 3) {
      this.scene.restart();
      this.level++; // Increment for the restart
    } else {
      alert("You are the Champion of the Realm!");
      this.scene.restart();
    }
  }

  private createTexture(key: string, width: number, height: number, color: number) {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.fillStyle(0xffffff, 0.2);
    graphics.fillRect(4, 4, width - 8, height - 8);
    graphics.generateTexture(key, width, height);
  }
}
