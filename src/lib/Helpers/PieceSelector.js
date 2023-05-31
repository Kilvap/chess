import Constants from "./Constants";

export default class PieceSelector {

    static getPiece(board, pieces, coordinates) {
        let pieceId = board[coordinates[0]][coordinates[1]];
        if (pieceId === null) {
            return null;
        }

        return pieces[pieceId];
    }

    static isKing(board, pieces, coordinates) {
        return PieceSelector.isType(board, pieces, coordinates, Constants.KING);
    }

    static isPawn(board, pieces, coordinates) {
        return PieceSelector.isType(board, pieces, coordinates, Constants.PAWN);
    }

    static isType(board, pieces, coordinates, type) {
        let piece = PieceSelector.getPiece(board, pieces, coordinates);
        if (piece === null) {
            return false;
        }

        if (piece.type === type) {
            return true;
        }

        return false;
    }

    static getKingPositions(board, pieces) {
        let positions = [[],[]];

        for(var r = 0; r < board.length; r++) {
            for (var c = 0; c < board[r].length; c++) {

                let pieceId = board[r][c];
                if (pieceId === null) {
                    continue;
                }

                let piece = pieces[pieceId];
                if (!!piece && piece.type === Constants.KING) {
                    positions[piece.owner] = [r, c];
                }
            }
        }

        return positions;
    }
}
