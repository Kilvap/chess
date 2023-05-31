import Piece from './Piece.js';

export default class Bishop extends Piece {

    getValidMoves(board, pieces, source) {

        let validMoves = [];

        let row = source[0];
        let col = source[1];

        // check north east
        var r = row - 1;
        var c = col + 1;
        while( r >= 0 && c < board[r].length ) {
            if (!this.addValidMove(board, pieces, source, validMoves, r, c)) {
                break;
            }

            r -= 1
            c += 1
        }

        // check north west
        r = row - 1;
        c = col - 1;
        while( r >= 0 && c >= 0 ) {
            if (!this.addValidMove(board, pieces, source, validMoves, r, c)) {
                break;
            }

            r -= 1
            c -= 1
        }

        // check south east
        r = row + 1;
        c = col + 1;
        while( r < board.length && c < board[r].length ) {
            if (!this.addValidMove(board, pieces, source, validMoves, r, c)) {
                break;
            }

            r += 1
            c += 1
        }

        // check south west
        r = row + 1;
        c = col - 1;
        while( r < board.length && c >= 0 ) {
            if (!this.addValidMove(board, pieces, source, validMoves, r, c)) {
                break;
            }

            r += 1
            c -= 1
        }

        return validMoves;
    }
}
