import PieceSelector from '../../Helpers/PieceSelector';
import { Move } from '../../Game/GameActions';

export default class Piece {

    // Helper for adding moves in a particular direction until we can't
    addValidMove(board, pieces, source, validMoves, row, col) {
        if (board[row][col] === null) {
            validMoves.push(Move.move(source, [row, col]));

            return true;
        }
        else {
            // hit a piece, check if it's opponents
            if (!this.squareHasSamePiece(board, pieces, source, [row, col])) {
                validMoves.push(Move.move(source, [row, col]));
            }

            return false;
        }
    }

    squareHasSamePiece(board, pieces, source, destination) {
        let sourcePiece = PieceSelector.getPiece(board, pieces, source);
        let destinationPiece = PieceSelector.getPiece(board, pieces, destination);
        
        if (!!sourcePiece && !!destinationPiece && sourcePiece.owner === destinationPiece.owner) {
            return true
        }

        return false;
    }

    // TO BE OVERWRITTEN
    getValidMoves(_board, _pieces, _destination) {
        return [];
    }

    isValidMove(board, pieces, move) {
        let source = move.payload.source;
        let validMoves = this.getValidMoves(board, pieces, source);

        for (var i in validMoves) {
            let validMove = validMoves[i];

            if (Move.isEqual(move, validMove)) {
                return true;
            }
        }

        return false;
    }
}
