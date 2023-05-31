import Piece from './Piece.js';

export default class Queen extends Piece {

    getValidMoves(board, pieces, source) {

        let validMoves = [];

        let row = source[0];
        let col = source[1];

        // Check ROOK MOVES:

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

        // CHECK BISHOP MOVES:

        // check north east
        r = row - 1;
        c = col + 1;
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
