import PieceSelector from '../Helpers/PieceSelector';

export default class PieceMovement {
    constructor(pieces) {
        this.pieces = pieces;
    }

    movedOffBoard(state, _source, destination) {
        const boardLengthCol = state.board[0].length;
        const boardLengthRow = state.board.length

        // We moved off the board
        if (destination[0] < 0 || destination[0] >= boardLengthRow || 
            destination[1] < 0 || destination[1] >= boardLengthCol) {
                return true;
        }

        return false;
    }

    pieceTypeExists(piece) {
        return !!this.pieces[piece.type];
    }

    isValidMove(state, move) {
        let source = move.payload.source;
        let destination = move.payload.destination;

        if (source.length === 0) {
            return false;
        }

        if (destination.length === 0) {
            return false;
        }

        let piece = PieceSelector.getPiece(state.board, state.pieces, source);

        if (piece === null) {
            return false;
        }

        if (this.movedOffBoard(state, source, destination)) {
            return false;
        }

        if (!this.pieceTypeExists(piece)) {
            return false;
        }

        return this.pieces[piece.type].isValidMove(state.board, state.pieces, move);
    }

    getValidMoves(board, pieces, source) {

        let piece = PieceSelector.getPiece(board, pieces, source);

        if (!piece) {
            return [];
        }

        if (!this.pieceTypeExists(piece)) {
            return [];
        }

        return this.pieces[piece.type].getValidMoves(board, pieces, source);
    }
}
