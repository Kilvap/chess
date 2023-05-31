import Piece from './Piece.js';

export default class Rook extends Piece {

    getValidMoves(board, pieces, source) {

        let validMoves = [];

        let row = source[0];
        let col = source[1];

        // check above us
        for (var r = row-1; r >= 0; r--) {
            if (!this.addValidMove(board, pieces, source, validMoves, r, col)) {
                break;
            }
        }

        // check below us
        for (r = row+1; r < board.length; r++) {
            if (!this.addValidMove(board, pieces, source, validMoves, r, col)) {
                break;
            }
        }

        // check to the left
        for (var c = col-1; c >= 0; c--) {
            if (!this.addValidMove(board, pieces, source, validMoves, row, c)) {
                break;
            }
        }

        // check to the right
        for (c = col+1; c < board[row].length; c++) {
            if (!this.addValidMove(board, pieces, source, validMoves, row, c)) {
                break;
            }
        }

        return validMoves;
    }
}
