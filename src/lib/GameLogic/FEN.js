import constants from "../Helpers/Constants";
import PieceSelector from "../Helpers/PieceSelector";
import Coordinates from "../Helpers/Coordinates";
import King from '../GameLogic/Pieces/King';
import BoardSelector from "../Helpers/BoardSelector";

// Helper class for converting our board state to FEN Notation:
// https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

export default class FEN {

    static getPieceRepresentation(gameState, piece) {

        let firstLetter = piece.type[0];

        if (gameState.meta.players[piece.owner].side === constants.BLACK) {
            return firstLetter.toLowerCase();
        } else {
            return firstLetter.toUpperCase();
        }
    }

    static getEmptySquaresString(emptySquares) {
        let emptySquaresString = (emptySquares === 0) ? "" : emptySquares.toString();
        return emptySquaresString;
    }

    static getPiecePositionStringWhitePerspective(gameState) {

        let result = "";
        let emptySquares = 0;

        for (var r = 0; r < gameState.board.length; r++) {
            emptySquares = 0;
            for (var c = 0; c < gameState.board[r].length; c++) {
                let piece = PieceSelector.getPiece(gameState.board, gameState.pieces, [r,c]);

                if (piece === null) {
                    emptySquares += 1;
                }
                else {
                    result += FEN.getEmptySquaresString(emptySquares) + FEN.getPieceRepresentation(gameState, piece);
                    emptySquares = 0;
                }
            }

            result += FEN.getEmptySquaresString(emptySquares);

            if (r < gameState.board.length - 1) {
                result += "/";
            }
        }

        return result;
    }

    static getPiecePositionStringBlackPerspective(gameState) {

        let result = "";
        let emptySquares = 0;

        for (var r = 7; r >= 0; r--) {
            emptySquares = 0;
            for (var c = 7; c >= 0; c--) {
                let piece = PieceSelector.getPiece(gameState.board, gameState.pieces, [r,c]);

                if (piece === null) {
                    emptySquares += 1;
                }
                else {
                    result += FEN.getEmptySquaresString(emptySquares) + FEN.getPieceRepresentation(gameState, piece);
                    emptySquares = 0;
                }
            }

            result += FEN.getEmptySquaresString(emptySquares);

            if (r > 0) {
                result += "/";
            }
        }

        return result;
    }

    static getPiecePositionString(gameState) {
        let perspective = BoardSelector.originalPerspective(gameState.meta);

        if (perspective === constants.BLACK) {
            return FEN.getPiecePositionStringBlackPerspective(gameState);
        }

        return FEN.getPiecePositionStringWhitePerspective(gameState);
    }

    static getTurnString(gameState) {
        if (gameState.meta.players[gameState.turn].side === constants.BLACK) {
            return "b";
        } else {
            return "w";
        }
    }
    
    // KQkq 
    static getCastleAbilityString(gameState) {
        let kingPositions = PieceSelector.getKingPositions(gameState.board, gameState.pieces);
        let result = "";

        for (var playerIndex = 0; playerIndex < kingPositions.length; playerIndex++) {
            let kingPosition = kingPositions[playerIndex];
            let castleAbility = [King.canCastleShort(gameState.board, gameState.pieces, kingPosition),
                                 King.canCastleLong(gameState.board, gameState.pieces, kingPosition)];

            // can't castle
            if (!castleAbility[0] && !castleAbility[1]) {
                continue;
            }
            
            let response = "";
            if (castleAbility[0]) {
                response += "k";
            }

            if (castleAbility[1]) {
                response += "q"
            }

            if (gameState.meta.players[playerIndex].side === constants.WHITE) {
                response = response.toUpperCase();
            }

            result += response;
        }

        return result === "" ? "-" : result;
    }

    static getEnPassantSquareString(gameState) {

        let perspective = BoardSelector.originalPerspective(gameState.meta);

        let enPassantEligible = [];
        for (var r = 0; r < gameState.board.length; r++) {
            for (var c = 0; c < gameState.board[r].length; c++) {
                let piecePosition = [r, c];
                let piece = PieceSelector.getPiece(gameState.board, gameState.pieces, piecePosition);

                if (!!piece && piece.type === constants.PAWN && piece.enpassantEligible) {
                    enPassantEligible = piecePosition;
                }
            }
        }

        if (enPassantEligible.length === 0) {
            return "-";
        } else {
            return Coordinates.screenToBoard(perspective, enPassantEligible);
        }
    }

    // TODO:
    static getHalfMoveString(gameState) {
        return 0;
    }

    // TODO:
    static getFullMoveString(gameState) {
        return 0;
    }

    static getString(gameState) {

        let sections = [
            FEN.getPiecePositionString(gameState),
            FEN.getTurnString(gameState),
            FEN.getCastleAbilityString(gameState),
            FEN.getEnPassantSquareString(gameState),
            FEN.getHalfMoveString(gameState),
            FEN.getFullMoveString(gameState)
        ];

        return sections.join(" ");
    }
}