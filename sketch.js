var canvas;
var backgroundImage, bgImg, car1_img, car2_img, track, car3_img, car4_img;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2, car3, car4;
var cars = [];
var fuels, powerCoins, obstacles;

function preload() {
    backgroundImage = loadImage("./assets/planodefundo.png");
    car1_img = loadImage("./assets/car1.png");
    car2_img = loadImage("./assets/car2.png");
    track = loadImage("./assets/track.jpg");
    car3_img = loadImage("./assets/carlão.png");
    car4_img = loadImage("./assets/a.png");
    b = loadImage("./assets/b.png");
    fueu = loadImage("./assets/fuel.png");
    trem = loadImage("./assets/iliketrains.png");
    policia = loadImage("./assets/policialcapitalista.png");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    database = firebase.database();
    game = new Game();
    game.getState();
    game.start();
}

function draw() {
    background(backgroundImage);
    if (playerCount === 4) {
        game.update(1);
    }

    if (gameState === 1) {
        game.play();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
