const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

function preload() {
    this.load.image('background', 'assets/background.png');  // Laad je achtergrondafbeelding
    this.load.image('ground', 'assets/ground.png');          // Laad je grondafbeelding
    this.load.image('obstacle', 'assets/obstacle.png');      // Laad je obstakelafbeelding
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });  // Laad je speler sprite
}

function create() {
    this.add.image(400, 300, 'background');

    const ground = this.physics.add.staticGroup();
    ground.create(400, 568, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWo
}
