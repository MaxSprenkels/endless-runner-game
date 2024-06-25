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

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('obstacle', 'assets/obstacle.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Voeg achtergrond toe en schaal deze
    let background = this.add.image(config.width / 2, config.height / 2, 'background');
    background.setDisplaySize(config.width, config.height);

    // Voeg grond toe en schaal deze
    const ground = this.physics.add.staticGroup();
    let groundImage = ground.create(config.width / 2, config.height - 32, 'ground');
    groundImage.setDisplaySize(config.width, 64).refreshBody();

    // Voeg speler toe en schaal deze
    player = this.physics.add.sprite(100, config.height - 150, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(1);

    // Voeg animaties toe
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

    // Voeg cursors toe
    cursors = this.input.keyboard.createCursorKeys();

    // Voeg obstakels toe en schaal deze
    obstacles = this.physics.add.group({
        key: 'obstacle',
        repeat: 5,
        setXY: { x: 600, y: 0, stepX: 300 }
    });

    obstacles.children.iterate(function (child) {
        child.setScale(0.1);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(player, ground);
    this.physics.add.collider(obstacles, ground);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    // Voeg score toe
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Laat de speler automatisch naar voren rennen
    player.setVelocityX(160);
    player.anims.play('right', true);
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    // Zorg ervoor dat de speler altijd naar rechts blijft rennen
    player.setVelocityX(160);

    // Laat de 'right' animatie altijd afspelen terwijl de speler beweegt
    if (player.body.velocity.x !== 0) {
        player.anims.play('right', true);
    } else {
        player.anims.play('turn', true);
    }
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}
