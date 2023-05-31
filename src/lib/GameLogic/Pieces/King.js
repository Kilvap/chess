import Piece from './Piece.js';
import { Move } from '../../Game/GameActions';
import PieceSelector from '../../Helpers/PieceSelector.js';
import constants from '../../Helpers/Constants.js';

export default class King extends Piece {

    constructor() {
        super();

        this.moveDeltas = [
            // [col, row]

            // north
            [-1,1],
            [-1,0], 
            [-1,-1],

            // south
            [1, 1],
            [1, 0],
            [1, -1],

            // sides
            [0, 1],
            [0, -1]
        ];
    }

    // // returns [canCastleKingSide, canCastleQueenSide]
    // static playerCanCastle(board, pieces, playerIndex) {
    //     let kingPositions = PieceSelector.getKingPositions(board, pieces);
    //     return King.canCastle(board, pieces, kingPositions[playerIndex]);
    // }

    // // returns [canCastleKingSide, canCastleQueenSide]
    // static canCastle(board, pieces, kingPosition) {
    //     let leftCornerPiecePosition = [kingPosition[0], 0];
    //     let leftDelta = kingPosition[1] - leftCornerPiecePosition[1];

    //     let canCastleLeft = King.canCastleLeft(board, pieces, kingPosition);
    //     let canCastleRight = King.canCastleRight(board, pieces, kingPosition);

    //     if (leftDelta === 3) {
    //         // castle King side on the left
    //         return [canCastleLeft, canCastleRight];
    //     } else {
    //         // castle Queen side on the left
    //         return [canCastleRight, canCastleLeft];
    //     }

    //     return [King.canCastleLong(board, pieces, kingPosition), King.canCastleShort(board, pieces, kingPosition)]
    // }

    static pathToLeftRookClear(board, source) {
        for (var c = source[1] - 1; c > 0; c--){
            if (board[source[0]][c] !== null) {
                return false;
            }
        }

        return true;
    }

    static pathToRightRookClear(board, source) {
        for (var c = source[1] + 1; c < board[0].length - 1; c++){
            if (board[source[0]][c] !== null) {
                return false;
            }
        }

        return true;
    }

    static canCastleLeft(board, pieces, source) {
        let king = PieceSelector.getPiece(board, pieces, source);
        let leftCornerPiece = PieceSelector.getPiece(board, pieces, [source[0], 0]);
        
        return (leftCornerPiece !== null &&
                leftCornerPiece.type === constants.ROOK &&
                leftCornerPiece.moves === 0 &&
                king.moves === 0 &&
                king.checked === false &&
                King.pathToLeftRookClear(board, source))
    }

    static canCastleRight(board, pieces, source) {
        let king = PieceSelector.getPiece(board, pieces, source);
        let rightCornerPiece = PieceSelector.getPiece(board, pieces, [source[0], board[0].length - 1]);

        return (rightCornerPiece !== null &&
                rightCornerPiece.type === constants.ROOK  &&
                rightCornerPiece.moves === 0 &&
                king.moves === 0 &&
                king.checked === false &&
                King.pathToRightRookClear(board, source))
    }

    static canCastleLong(board, pieces, kingPosition) {
        let left = [kingPosition[0], 0];
        let leftDelta = kingPosition[1] - left[1];

        // leftDelta is either 3 or 4
        if (leftDelta === 4) {
            return this.canCastleLeft(board, pieces, kingPosition);
        } else {
            return this.canCastleRight(board, pieces, kingPosition);
        }
    }

    static canCastleShort(board, pieces, kingPosition) {
        let left = [kingPosition[0], 0];
        let leftDelta = kingPosition[1] - left[1];

        // leftDelta is either 3 or 4
        if (leftDelta === 3) {
            return this.canCastleLeft(board, pieces, kingPosition);
        } else {
            return this.canCastleRight(board, pieces, kingPosition);
        }
    }

    static castleLongDestination(kingPosition) {
        let left = [kingPosition[0], 0];
        let leftDelta = kingPosition[1] - left[1];

        if (leftDelta === 4) {
            return [kingPosition[0], kingPosition[1] - 2];
        } else {
            return [kingPosition[0], kingPosition[1] + 2];
        }
    }

    static castleShortDestination(kingPosition) {
        let left = [kingPosition[0], 0];
        let leftDelta = kingPosition[1] - left[1];

        if (leftDelta === 3) {
            return [kingPosition[0], kingPosition[1] - 2];
        } else {
            return [kingPosition[0], kingPosition[1] + 2];
        }
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

        // Check for castling opportunities
        if (King.canCastleShort(board, pieces, source)) {
            let destination = King.castleShortDestination(source);
            validMoves.push(Move.castleShort(source, destination));
        }

        if (King.canCastleLong(board, pieces, source)) {
            let destination = King.castleLongDestination(source);
            validMoves.push(Move.castleLong(source, destination));
        }

        return validMoves;
    }
}
