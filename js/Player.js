class Player {
    constructor() {
        this.name = null;
        this.index = null;
        this.positionX = 0;
        this.positionY = 0;
        this.fuel = 200;
        this.score = 0;
    }

    addPlayer() {
        var playerIndex = "players/player" + this.index;

        if (this.index === 1) {
            (this.positionX = width / 2 - 300), height - 100;
        } else if (this.index === 2) {
            (this.positionX = width / 2 - 100), height - 100;
        } else if (this.index === 3) {
            (this.positionX = width / 2 + 200), height - 100;
        } else {
            (this.positionX = width / 2 + 70), height - 150;
        }

        database.ref(playerIndex).set({
            name: this.name,
            positionX: this.positionX,
            positionY: this.positionY,
        });
    }

    getCount() {
        var playerCountRef = database.ref("playerCount");
        playerCountRef.on("value", (data) => {
            playerCount = data.val();
        });
    }

    getDistance() {
        var playerDistanceRef = database.ref("players/player" + this.index);
        playerDistanceRef.on("value", (data) => {
            var data = data.val();
            this.positionX = data.positionX;
            this.positionY = data.positionY;
        });
    }
    updateCount(count) {
        database.ref("/").update({
            playerCount: count,
        });
    }
    update() {
        var playerIndex = "players/player" + this.index;
        database.ref(playerIndex).update({
            positionX: this.positionX,
            positionY: this.positionY,
        });
    }
    static getPlayersInfo() {
        var playerInfo = database.ref("players");
        playerInfo.on("value", (data) => {
            allPlayers = data.val();
        });
    }
}
