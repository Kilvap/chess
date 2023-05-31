import Piece from './Piece.js';
import { Move } from '../../Game/GameActions';

export default class Knight extends Piece {

    constructor() {
        super();

        this.moveDeltas = [
            // [col, row]

            // Moving north
            [2,1], 
            [2,-1],

            // Moving south
            [-2, 1],
            [-2, -1],

            // Moving west
            [1, 2],
            [-1, 2],

            // Moving east
            [1, -2],
            [-1, -2],
        ];
    }

    getValidMoves(board, pieces, source) {

        let validMoves = [];

        for (var i in this.moveDeltas) {
            let potentialMove = [0,0];
            potentialMove[0] = source[0] + this.moveDeltas[i][0];
            potentialMove[1] = source[1] + this.moveDeltas[i][1];

            // check that we're on the board
            if ( (potentialMove[0] < 0 || potentialMove[0] >= board[0].length) || 
                 (potentialMove[1] < 0 || potentialMove[1] >= board.length) ) {
                    continue;
            }

            // check that we're not moving onto our own piece
            if (this.squareHasSamePiece(board, pieces, source, potentialMove)) {
                continue;
            }

            validMoves.push(Move.move(source, potentialMove));
        }

        return validMoves;
    }
}
