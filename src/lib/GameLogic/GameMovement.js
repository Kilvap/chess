import { Move } from "../Game/GameActions";
import constants from "../Helpers/Constants";
import PieceSelector from "../Helpers/PieceSelector";

export default class GameMovement {
    constructor(pieceMovement) {
        this.pieceMovement = pieceMovement;
    }

    // Returns valid moves after performing pin checking
    getValidMoves(board, pieces, source) {
        let filteredValidMoves = [];
        let validMoves = this.pieceMovement.getValidMoves(board, pieces, source);

        // exclude the validMoves that leave our king under threat
        var newBoard =  JSON.parse(JSON.stringify(board));
        let pieceId = board[source[0]][source[1]];
        let piece = pieces[pieceId];

        for (var i = 0; i < validMoves.length; i++) {

            // TODO: check that valid moves are type basic?

            // move the piece on the new board
            let destination = validMoves[i].payload.destination;
            let destinationPiece = newBoard[destination[0]][destination[1]];

            newBoard[source[0]][source[1]] = null;
            newBoard[destination[0]][destination[1]] = pieceId;

            // make sure we're not checked after our move
            if (!this.playerIsChecked(newBoard, pieces, piece.owner)) {
                filteredValidMoves.push(validMoves[i]);
            }

            // revert board state
            newBoard[destination[0]][destination[1]] = destinationPiece;
            newBoard[source[0]][source[1]] = pieceId;
        }

        return filteredValidMoves;
    }

    // Searches for the king.checked property of player
    playerIsCheckedSimple(_board, pieces, playerIndex) {
        for (var pieceId in pieces) {
            let piece = pieces[pieceId];

            if (piece.type === constants.KING && piece.owner === playerIndex) {
                return piece.checked;
            }
        }

        // shouldn't reach here
        return false;
    }

    // Check whether the player is checked given this state
    playerIsChecked(board, pieces, playerIndex) {
        let kingPositions = PieceSelector.getKingPositions(board, pieces);

        for (var row = 0; row < board.length; row++) {
            for (var col = 0; col < board[row].length; col++) {

                let position = [row, col];
                let piece = PieceSelector.getPiece(board, pieces, position);

                if (piece === null || piece.owner === playerIndex) {
                    continue;
                }

                let validMoves = this.pieceMovement.getValidMoves(board, pieces, position);
                for (var i = 0; i < validMoves.length; i++) {
                    // Because valid moves may be of type "move" or "promote", we test for destination equivalence here.
                    if (Move.destinationsEqual(validMoves[i], Move.move(position, kingPositions[playerIndex]))) {
                        return true;
                    }
                }
            }    
        }

        return false;
    }

    // Check whether the player has moves given this state
    playerHasMoves(board, pieces, playerIndex) {

        for (var r = 0; r < board.length; r++) {
            for (var c = 0; c < board[r].length; c++) {

                let pieceId = board[r][c];

                if (pieceId === null) {
                    continue;
                }

                let piece = pieces[pieceId];
                if (piece.owner !== playerIndex) {
                    continue;
                }

                let validMoves = this.getValidMoves(board, pieces, [r,c]);
                if (validMoves.length > 0) {
                    return true;
                }
            }
        }

        return false;
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