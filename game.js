const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let obstacles;
let score = 0;
let scoreText;
let gameOver = false;
let lastObstacleTime = 0;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('obstacle', 'assets/obstacle.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background').setOrigin(0, 0);

    const ground = this.physics.add.staticGroup();
    ground.create(config.width / 2, config.height - 32, 'ground').setDisplaySize(config.width, 64).refreshBody();

    player = this.physics.add.sprite(100, config.height - 95, 'player');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    obstacles = this.physics.add.group();
    generateObstacle();

    this.physics.add.collider(player, ground);
    this.physics.add.collider(obstacles, ground);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    player.setVelocityX(160);
    player.anims.play('right', true);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

function update(time) {
    if (gameOver) {
        return;
    }

    this.background.tilePositionX += 5;

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-250);
    }

    player.x = 100;

    obstacles.children.iterate(function (child) {
        if (child) {
            child.x -= 5;

            if (child.x < -child.width) {
                child.destroy();
            }

            if (child.x < player.x && !child.passed) {
                score += 1;
                scoreText.setText('Score: ' + score);
                child.passed = true;
            }
        }
    });

    if (time > lastObstacleTime + Phaser.Math.Between(1000, 3000)) {
        generateObstacle();
        lastObstacleTime = time;
    }
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}

function generateObstacle() {
    const obstacleX = config.width + Phaser.Math.Between(300, 800);
    const obstacleY = config.height - 89;
    const obstacle = obstacles.create(obstacleX, obstacleY, 'obstacle');
    obstacle.setScale(0.1);
    obstacle.setBounce(0);
    obstacle.body.setAllowGravity(false);
}
