
export default class SoundFX {
    
    constructor() {
        this.player = new Audio("/chess/sounds/soundfx.mp3");
        // this.player.oncanplaythrough = function() {
        // }.bind(this);
    }

    async playSound(time) {
        this.player.startTime = time;
        this.player.currentTime = time;

        this.player.ontimeupdate = function() {

            if (this.player.currentTime - this.player.startTime > 0.5) {
                this.player.pause();
                this.player.ontimeupdate = null;
            }

        }.bind(this);

        await this.player.play();
    }

    async playMove() {
        // Plays at 1s or 2s.
        let time = Math.floor(Math.random() * 2) + 1;
        this.playSound(time);
    }

    async playCastle() {
        // Plays at 3s or 4s
        let time = Math.floor(Math.random() * 2) + 3;
        this.playSound(time);
    }

    async playCapture() {
        // Plays at 5s or 6s
        let time = Math.floor(Math.random() * 2) + 5;
        this.playSound(time);
    }

    async playCheck() {
        // Plays at 7s or 8s
        let time = Math.floor(Math.random() * 2) + 7;
        this.playSound(time);
    }

    async playDefeat() {
        // Plays at 9s
        let time = 9;
        this.playSound(time);
    }

    async playCheckmate() {
        // Plays at 10s
        let time = 10;
        this.playSound(time);
    }

    async playPromote() {
        this.playMove();
    }
}
