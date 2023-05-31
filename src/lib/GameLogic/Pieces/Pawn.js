import PieceSelector from '../../Helpers/PieceSelector.js';
import Piece from './Piece.js';
import { Move } from '../../Game/GameActions';
import constants from '../../Helpers/Constants.js';

export default class Pawn extends Piece {

    getValidMove(board, source, destination) {
        // Check if we're entering a promotion square
        if (destination[0] === 0 || destination[0] === board[0].length - 1) {
            return [Move.promote(source, destination, constants.QUEEN), 
                    Move.promote(source, destination, constants.ROOK),
                    Move.promote(source, destination, constants.BISHOP),
                    Move.promote(source, destination, constants.KNIGHT)];
        } else {
            return [Move.move(source, destination)];
        }
    }

    isInBounds(board, coordinate) {
        return (
            coordinate[0] >= 0 &&
            coordinate[0] < board.length &&
            coordinate[1] >= 0 &&
            coordinate[1] < board[0].length
        );
    }

    getValidMoves(board, pieces, source) {
        let validMoves = [];
        let sourcePiece =  PieceSelector.getPiece(board, pieces, source);
        let deltaRow = this.getValidMoveDeltaRow(board, pieces, source);

        // Check moving forwards
        let canMoveForward = false;
        let moveForward = [source[0]+deltaRow, source[1]];
        if (this.isInBounds(board, moveForward) && board[moveForward[0]][moveForward[1]] === null) {
            canMoveForward = true;
            validMoves = validMoves.concat(this.getValidMove(board, source, moveForward));
        }

        // This move must have an opponent piece in the destination (an attack)
        let moveRight = [source[0]+deltaRow, source[1]+1];
        if (this.isInBounds(board, moveRight)) {
            let piece = PieceSelector.getPiece(board, pieces, moveRight);
            if (!!piece && piece.owner !== sourcePiece.owner) {
                validMoves = validMoves.concat(this.getValidMove(board, source, moveRight));
            }
        }

        // This move must have an opponent piece in the destination (an attack)
        let moveLeft = [source[0]+deltaRow, source[1]-1];
        if (this.isInBounds(board, moveLeft)) {
            let piece = PieceSelector.getPiece(board, pieces, moveLeft);
            if (!!piece && piece.owner !== sourcePiece.owner) {
                validMoves = validMoves.concat(this.getValidMove(board, source, moveLeft));
            }
        }

        // Can initially move 2 squares
        if (sourcePiece.moves === 0 && canMoveForward) {
            let moveForward2 = [source[0] + (deltaRow * 2), source[1]];
            if (this.isInBounds(board, moveForward2) && board[moveForward2[0]][moveForward2[1]] === null) {
                validMoves.push(Move.move(source, moveForward2));
            }
        }

        // Check en-passant opportunities

        // Check left if we're not on the left edge
        if (source[1] > 0) {
            let pieceLeftPosition = [source[0], source[1] - 1];
            let pieceLeft = PieceSelector.getPiece(board, pieces, pieceLeftPosition);

            if (!!pieceLeft && pieceLeft.type === constants.PAWN && pieceLeft.enpassantEligible) {
                let destination = [pieceLeftPosition[0] + deltaRow, pieceLeftPosition[1]];
                validMoves.push(Move.enpassant(source, destination, pieceLeftPosition));
            }
        }

        // Check right if we're not on the right edge
        if (source[1] < 7) {
            let pieceRightPosition = [source[0], source[1] + 1];
            let pieceRight = PieceSelector.getPiece(board, pieces, pieceRightPosition);

            if (!!pieceRight && pieceRight.type === constants.PAWN && pieceRight.enpassantEligible) {
                let destination = [pieceRightPosition[0] + deltaRow, pieceRightPosition[1]];
                validMoves.push(Move.enpassant(source, destination, pieceRightPosition));
            }
        }

        return validMoves;
    }

    static isEnPassantEligible(source, destination) {
        let YDelta = source[0] - destination[0];
        return (YDelta === -2 || YDelta === 2);
    }

    isPawn(board, pieces, source) {
        return PieceSelector.isPawn(board, pieces, source);
    }

    getValidMoveDeltaRow(board, pieces, source) {
        let piece = PieceSelector.getPiece(board, pieces, source);
        if (piece.direction === constants.NORTH) {
            return -1;
        } else {
            return 1;
        }
    }
}
