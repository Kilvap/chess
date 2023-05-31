class UIPlayer {

    constructor() {
        this.emitter = null;
    }

    getMove() {

        let promise = new Promise((resolve) => {
            this.emitter = function(move) {
                resolve(move);
            }
        });

        return promise;
    }

    // The promise from getMove() resolves when this method is called
    move(move) {
        this.emitter(move);
        this.emitter = null;
    }
}

export default UIPlayer;
