class Game {
    constructor() {
        this.resetTitle = createElement("h2");
        this.resetButton = createButton("");

        this.leadeboardTitle = createElement("h2");

        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");
    }

    getState() {
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        });
    }
    update(state) {
        database.ref("/").update({
            gameState: state,
        });
    }
    start() {
        player = new Player();
        playerCount = player.getCount();

        fuels = new Group();
        powerCoins = new Group();
        obstacles = new Group();

        var obstaclesPositions = [
            { x: width / 2 + 250, y: height - 800, image: trem },
            { x: width / 2 - 150, y: height - 1300, image: b },
            { x: width / 2 + 250, y: height - 1800, image: trem },
            { x: width / 2 - 180, y: height - 2300, image: b },
            { x: width / 2, y: height - 2800, image: trem },
            { x: width / 2 - 180, y: height - 3300, image: b },
            { x: width / 2 + 180, y: height - 3300, image: trem },
            { x: width / 2 + 250, y: height - 3800, image: b },
            { x: width / 2 - 150, y: height - 4300, image: trem },
            { x: width / 2 + 250, y: height - 4800, image: b },
            { x: width / 2, y: height - 5300, image: trem },
            { x: width / 2 - 180, y: height - 5500, image: trem },
            { x: width / 2 - 100, y: height - 1000, image: trem },
        ];

        form = new Form();
        form.display();

        car1 = createSprite(width / 2 - 300, height - 100);
        car1.addImage("car1", car1_img);
        car1.scale = 0.07;

        car2 = createSprite(width / 2 - 100, height - 100);
        car2.addImage("car2", car2_img);
        car2.scale = 0.07;

        car3 = createSprite(width / 2 + 200, height - 100);
        car3.addImage("car3", car3_img);
        car3.scale = 0.17;

        car4 = createSprite(width / 2 + 70, height - 100);
        car4.addImage("car4", car4_img);
        car4.scale = 0.1;

        cars = [car1, car2, car3, car4];
        this.addSprites(powerCoins, 20, policia, 0.02);
        this.addSprites(fuels, 5, fueu, 0.17);
        this.addSprites(
            obstacles,
            obstaclesPositions.length,
            trem,
            0.08,
            obstaclesPositions
        );
    }

    addSprites(
        spriteGroup,
        numberOfSprites,
        spriteImage,
        scale,
        positions = []
    ) {
        for (var i = 0; i < numberOfSprites; i++) {
            var x, y;

            //C41 //SA
            if (positions.length > 0) {
                x = positions[i].x;
                y = positions[i].y;
                spriteImage = positions[i].image;
            } else {
                x = random(width / 2 + 150, width / 2 - 150);
                y = random(-height * 4.5, height - 400);
            }
            var sprite = createSprite(x, y);
            sprite.addImage("sprite", spriteImage);

            sprite.scale = scale;
            spriteGroup.add(sprite);
        }
    }

    handleElements() {
        form.hide();
        form.titleImg.position(40, 50);
        form.titleImg.class("gameTitleAfterEffect");

        //C39
        this.resetTitle.html("Reinicar Jogo");
        this.resetTitle.class("resetText");
        this.resetTitle.position(width / 2 + 200, 40);

        this.resetButton.class("resetButton");
        this.resetButton.position(width / 2 + 230, 100);

        this.leadeboardTitle.html("Placar");
        this.leadeboardTitle.class("resetText");
        this.leadeboardTitle.position(width / 3 - 60, 40);

        this.leader1.class("leadersText");
        this.leader1.position(width / 3 - 50, 80);

        this.leader2.class("leadersText");
        this.leader2.position(width / 3 - 50, 130);
    }

    play() {
        this.handleElements();
        this.handleResetButton();
        Player.getPlayersInfo();

        if (allPlayers !== undefined) {
            image(track, 0, -height * 5, width, height * 6);

            //índice da matriz
            var index = 0;
            for (var plr in allPlayers) {
                //adicione 1 ao índice para cada loop
                index = index + 1;

                //use os dados do banco de dados para exibir os carros nas direções x e y
                var x = allPlayers[plr].positionX;
                var y = height - allPlayers[plr].positionY;

                cars[index - 1].position.x = x;
                cars[index - 1].position.y = y;

                if (index === player.index) {
                    stroke(10);
                    fill("silver");
                    ellipse(x, y, 60, 60);
                    this.handleFuel(index);
                    this.handlePowerCoins(index);
                    //alterar a posição da câmera na direção y

                    camera.position.y = cars[index - 1].position.y;
                }
            }

            this.handlePlayerControls();

            drawSprites();
        }
    }
    handleResetButton() {
        this.resetButton.mousePressed(() => {
            database.ref("/").set({
                playerCount: 0,
                gameState: 0,
                players: {},
            });
            window.location.reload();
        });
    }
    handlePlayerControls() {
        // manipulando eventos de teclado
        if (keyIsDown(UP_ARROW)) {
            player.positionY += 10;
            player.update();
        }
        if (keyIsDown(DOWN_ARROW)) {
            player.positionY -= 10;
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
            player.positionX -= 10;
            player.update();
        }
        if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
            player.positionX += 10;
            player.update();
        }
    }

    handleFuel(index) {
        //adicionando combustível
        cars[index - 1].overlap(fuels, function (collector, collected) {
            player.fuel = 185;
            //o sprite é coletado no grupo de colecionáveis que desencadeou
            //o evento
            collected.remove();
        });
    }

    handlePowerCoins(index) {
        cars[index - 1].overlap(powerCoins, function (collector, collected) {
            player.score += 21;
            player.update();
            //o sprite é coletado no grupo de colecionáveis que desencadeou
            //o evento
            collected.remove();
        });
    }

    showRank() {
        swal({
            title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
            text: "Você alcançou a linha de chegada com sucesso!",
            imageUrl:
                "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
            imageSize: "100x100",
            confirmButtonText: "Ok",
        });
    }

    gameOver() {
        swal({
            title: `Fim de Jogo`,
            text: "Oops você perdeu a corrida!",
            imageUrl:
                "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
            imageSize: "100x100",
            confirmButtonText: "Obrigado por jogar",
        });
    }
}
