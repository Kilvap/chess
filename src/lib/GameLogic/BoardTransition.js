import PieceSelector from "../Helpers/PieceSelector";
import constants from "../Helpers/Constants";
import { pieceState } from "../Game/GameState";
import { Move } from "../Game/GameActions";
import Pawn from "./Pieces/Pawn";

export default class BoardTransition {

    constructor(pieceMovement) {
        this.pieceMovement = pieceMovement;
    }

    // Clears pawn enpassantEligiblity and marks kings as checked
    updateMeta(board, pieces) {
        let kingPositions = PieceSelector.getKingPositions(board, pieces);

        let kingId1 = board[kingPositions[0][0]][kingPositions[0][1]];
        pieces[kingId1].checked = false;

        let kingId2 = board[kingPositions[1][0]][kingPositions[1][1]];
        pieces[kingId2].checked = false;

        for (var row = 0; row < board.length; row++) {
            for (var col = 0; col < board[row].length; col++) {

                let position = [row, col];
                let pieceId = board[row][col];
                let piece = PieceSelector.getPiece(board, pieces, position);

                if (piece === null) {
                    continue;
                }

                // clear pawn en-passant eligiblity
                if (piece.type === constants.PAWN) {
                    pieces[pieceId].enpassantEligible = false;
                }

                let validMoves = this.pieceMovement.getValidMoves(board, pieces, position);
                let opponentPlayerIndex = (piece.owner + 1) % 2;

                for (var i = 0; i < validMoves.length; i++) {
                    // Because valid moves may be of type "move" or "promote", we test for destination equivalence here.
                    if (Move.destinationsEqual(validMoves[i], Move.move(position, kingPositions[opponentPlayerIndex]))) {

                        let kingId = board[kingPositions[opponentPlayerIndex][0]][kingPositions[opponentPlayerIndex][1]];
                        pieces[kingId].checked = true;
                    }
                }
            }    
        }
    }

    move(currentBoard, currentPieces, move) {
        let source = move.payload.source;
        let destination = move.payload.destination;

        var pieceId = currentBoard[source[0]][source[1]];
        var board = JSON.parse(JSON.stringify(currentBoard));
        board[source[0]][source[1]] = null;
        board[destination[0]][destination[1]] = pieceId;

        // update pieces
        var pieces = JSON.parse(JSON.stringify(currentPieces));
        pieces[pieceId].moves = currentPieces[pieceId].moves + 1;

        // clear board meta data, and mark checks
        this.updateMeta(board, pieces);

        // enpassant
        let piece = PieceSelector.getPiece(currentBoard, currentPieces, source);
        if (!!piece && piece.type === constants.PAWN && Pawn.isEnPassantEligible(source, destination)) {
            pieces[pieceId].enpassantEligible = true;
        }

        return { board, pieces };
    }

    castleLeft(currentBoard, currentPieces, move) {
        let source = move.payload.source;
        let destination = move.payload.destination;

        var kingId = currentBoard[source[0]][source[1]];
        var rookId = null;
        let rookPosition = null;

        for (var c = destination[1]; c >= 0; c--) {

            // Find the rook
            let position = [destination[0], c];
            if(PieceSelector.isType(currentBoard, currentPieces, position, constants.ROOK)) {
                rookPosition = position;
                rookId = currentBoard[position[0]][position[1]];
                break;
            }
        }

        // move the king and rook into position
        if (!!rookId && !!rookPosition) {
            var board = JSON.parse(JSON.stringify(currentBoard));

            // move king
            board[source[0]][source[1]] = null;
            board[destination[0]][destination[1]] = kingId;
            
            // move rook (end up to the right of the king)
            board[rookPosition[0]][rookPosition[1]] = null;
            board[destination[0]][destination[1]+1] = rookId;

            // update pieces
            var pieces = JSON.parse(JSON.stringify(currentPieces));
            pieces[kingId].moves = currentPieces[kingId].moves + 1;

            // clear board meta data, and mark checks
            this.updateMeta(board, pieces);

            return { board, pieces };
        } 
        
        // failed to castle... (shouldn't reach here)
        return false;
    }

    castleRight(currentBoard, currentPieces, move) {
        let source = move.payload.source;
        let destination = move.payload.destination;

        var kingId = currentBoard[source[0]][source[1]];
        var rookId = null;
        let rookPosition = null;

        for (var c = destination[1]; c < currentBoard[source[0]].length; c++) {

            // find the rook
            let position = [destination[0], c];

            if(PieceSelector.isType(currentBoard, currentPieces, position, constants.ROOK)) {
                rookPosition = position;
                rookId = currentBoard[position[0]][position[1]];
                break;
            }
        }

        // move the king and rook into position
        if (!!rookId && !!rookPosition) {
            var board = JSON.parse(JSON.stringify(currentBoard));

            // move king
            board[source[0]][source[1]] = null;
            board[destination[0]][destination[1]] = kingId;
            
            // move rook (end up to the left of the king)
            board[rookPosition[0]][rookPosition[1]] = null;
            board[destination[0]][destination[1]-1] = rookId;

            // update pieces
            var pieces = JSON.parse(JSON.stringify(currentPieces));
            pieces[kingId].moves = currentPieces[kingId].moves + 1;

            // evaluate board
            this.updateMeta(board, pieces);

            return  { board, pieces };
        }

        // failed to castle... (shouldn't reach here)
        return false;
    }

    castle(currentBoard, currentPieces, move) {
        let source = move.payload.source;
        let destination = move.payload.destination;
        let direction = destination[1] - source[1];
        
        if (direction > 0) {
            return this.castleRight(currentBoard, currentPieces, move);
        } else {
            return this.castleLeft(currentBoard, currentPieces, move);
        }
    }

    enpassant(currentBoard, currentPieces, move) {
        let source = move.payload.source;
        let destination = move.payload.destination;
        let target = move.payload.target;

        var pieceId = currentBoard[source[0]][source[1]];
        var board = JSON.parse(JSON.stringify(currentBoard));

        board[source[0]][source[1]] = null;
        board[destination[0]][destination[1]] = pieceId;
        board[target[0]][target[1]] = null;

        // update pieces
        var pieces = JSON.parse(JSON.stringify(currentPieces));
        pieces[pieceId].moves = currentPieces[pieceId].moves + 1;

        // evaluate board
        this.updateMeta(board, pieces);

        return { board, pieces };
    }

    promote(currentBoard, currentPieces, move) {
        let source = move.payload.source;
        let destination = move.payload.destination;
        let pieceType = move.payload.pieceType;

        var pieceId = currentBoard[source[0]][source[1]];
        var board = JSON.parse(JSON.stringify(currentBoard));

        board[source[0]][source[1]] = null;
        board[destination[0]][destination[1]] = pieceId;

        // update pieces
        var pieces = JSON.parse(JSON.stringify(currentPieces));
        pieces[pieceId] = pieceState(pieceType, pieces[pieceId].owner);
        pieces[pieceId].moves = currentPieces[pieceId].moves + 1;

        // evaluate board
        this.updateMeta(board, pieces);

        return { board, pieces };
    }

    // returns { board, pieces } or false
    mapMoveToNewBoard(board, pieces, move) {
        switch (move.type) {
            case "move":
                return this.move(board, pieces, move);
            case "castleLong":
                return this.castle(board, pieces, move);
            case "castleShort":
                return this.castle(board, pieces, move);
            case "enpassant":
                return this.enpassant(board, pieces, move);
            case "promote":
                return this.promote(board, pieces, move);
            default:
                return false;
        }
    }

}