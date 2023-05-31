import { Move } from '../Game/GameActions.js';
import FEN from '../GameLogic/FEN.js';
import BoardSelector from '../Helpers/BoardSelector.js';
import Coordinates from '../Helpers/Coordinates.js';

class BotPlayer {

    constructor(gameLogic, engine) {
        this.gameLogic = gameLogic;
        this.engine = engine;

        // // 32 = hash size value
        this.engine.postMessage(`setoption name hash value 32`);
        // skill value [0-20]
        this.engine.postMessage(`setoption name skill level value 0`);
    }

    getMoveFromEngineResponse(gameState, response) {

        if (response === "(none)") {
            console.log("Response (none)", gameState);
            return null;
        }

        let perspective = BoardSelector.originalPerspective(gameState.meta);
        let source = Coordinates.boardToScreen(perspective, response.substring(0, 2));
        let destination = Coordinates.boardToScreen(perspective, response.substring(2, 4));

        // check for valid movies on this board
        let validMoves = this.gameLogic.getValidMoves(gameState.board, gameState.pieces, source);
        let suspectedMoves = [];

        for (var i = 0; i < validMoves.length; i++) {
            let validMove = validMoves[i];

            if (destination[0] === validMove.payload.destination[0] && 
               destination[1] === validMove.payload.destination[1]) 
            {
                suspectedMoves.push(validMove);
            }
        }

        if (suspectedMoves.length === 1) {
            return suspectedMoves[0];
        }

        // Multiple suspectedMoves matched stockfish response, it must be a pawn promotion,
        // we need to check the piece that stockfish promoted to.
        let piece = response[4]; // just a character like 'q', 'r', 'n', 'b'
        let promotionMove = suspectedMoves.filter((item) => {

            if (item.type === "promote" && item.payload.pieceType[0].toLowerCase() === piece) {
                return true;
            }
 
            return false;
        });

        if (promotionMove.length === 1) {
            return promotionMove[0];
        } else {
            let fenString = FEN.getString(gameState);
            console.log("Failed to map engine move...", gameState, response, fenString);
            return null; // We've failed to map the move properly.
        }
    }

    think(action) {
        setTimeout(action, 1000);
    }

    getMove(gameState) {
        return new Promise((resolve, reject) => {

            let fenString = FEN.getString(gameState);

            this.engine.postMessage(`position fen ${fenString}`);
            this.engine.postMessage(`go depth 2`);

            this.engine.onmessage = (message) => {
                const messageWords = message.data.split(' ');

                // Parse stockfish response and create game move
                if (messageWords[0] === 'bestmove') {

                    //console.log("Stockfish raw response:", messageWords);

                    this.engine.onmessage = null;
                    let move = this.getMoveFromEngineResponse(gameState, messageWords[1]);
                    
                    if (move === null) {
                        reject("No good moves");
                        return;
                    } 
                    
                    // Think then resolve move
                    this.think(() => resolve(Move.animated(move)));
                }
            }
        });
    }

    move() {

    }
}

export default BotPlayer;
