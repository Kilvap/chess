import PieceMovement from './PieceMovement.js';
import GameMovement from './GameMovement.js';
import BoardTransition from './BoardTransition.js';
import { buildGameStatus } from '../Helpers/GameStatus.js';
import PieceSelector from '../Helpers/PieceSelector.js';
import constants from '../Helpers/Constants.js';

import { PerformedMove } from '../MoveList/PerformedMove.js';

import Pawn from './Pieces/Pawn.js';
import Knight from './Pieces/Knight.js';
import Bishop from './Pieces/Bishop.js';
import Rook from './Pieces/Rook.js';
import Queen from './Pieces/Queen.js';
import King from './Pieces/King.js';

import SoundFX from '../Audio/SoundFX.js';

export default class GameLogic {

    constructor() {

        this.pieces = {
            [constants.PAWN]: new Pawn(),
            [constants.KNIGHT]: new Knight(),
            [constants.BISHOP]: new Bishop(),
            [constants.ROOK]: new Rook(),
            [constants.QUEEN]: new Queen(),
            [constants.KING]: new King(),
        };

        this.soundFX = new SoundFX();
        this.pieceMovement = new PieceMovement(this.pieces);
        this.gameMovement = new GameMovement(this.pieceMovement);
        this.boardTransition = new BoardTransition(this.pieceMovement);
    }

    getOpponentIndex(playerIndex) {
        return ((playerIndex + 1) % 2);
    }

    // Returns the valid moves for a selection, accounting for pins and checks.
    getValidMoves(board, pieces, source) {
        return this.gameMovement.getValidMoves(board, pieces, source);
    }
 
    isValidMove(gameState, move) {
        let { board, pieces, turn } = gameState;

        // The piece moving      
        let piece = PieceSelector.getPiece(board, pieces, move.payload.source);

        // Validate that the piece moving is of the player who's turn it is   
        if (piece === null || piece.owner !== turn) {
            return false;
        }

        // Check that the move is valid for the square
        if(!this.gameMovement.isValidMove(board, pieces, move)) {
            return false;
        }

        // Obtain new state given the move
        let newState = this.boardTransition.mapMoveToNewBoard(board, pieces, move);
        if (newState === false) {
            return false;
        }
    
        // Check that player that moved is not checked on new board
        if (this.gameMovement.playerIsCheckedSimple(newState.board, newState.pieces, turn)) {
            return false;
        }

        return true;
    }

    // applies a 'move', returning necessary state updates
    // assumes move validation has occurred prior to calling this method
    applyMove(state, action) {
        let move = action.payload;

        let transformations = this.boardTransition.mapMoveToNewBoard(state.board, state.pieces, move);
        if (transformations === false) {
            return state;
        }

        // Obtain new board and pieces state
        let newState = { ...state, ...transformations };

        // Player cannot move and remain checked
        if (this.gameMovement.playerIsCheckedSimple(newState.board, newState.pieces, state.turn)) {
            return state;
        }

        // Evaluate board state for opponent
        let opponent = this.getOpponentIndex(state.turn);
        let checked = this.gameMovement.playerIsCheckedSimple(newState.board, newState.pieces, opponent);
        let movesAvailable = this.gameMovement.playerHasMoves(newState.board, newState.pieces, opponent);
        newState.status = buildGameStatus(opponent, movesAvailable, checked);

        // Update the moves list
        let newMoves = [...state.moves];
        let piece = PieceSelector.getPiece(state.board, state.pieces, move.payload.source);
        newMoves.push(PerformedMove.create(piece, move));
        newState.moves = newMoves;

        // Update turn
        newState.turn = (state.turn + 1) % 2;

        // Play sound effects here?
        this.playSoundEffect(state, newState, move);

        return newState;
    }

    setStatus(state, action) {
        let newState = { ...state };
        let status = action.payload;

        newState.status = status;
        
        // Play sound effect here?

        return newState;
    }

    playSoundEffect(oldState, newState, move) {

        if (newState.status.checked && !newState.status.movesAvailable) {
            this.soundFX.playCheckmate();
            return;
        }

        if (!newState.status.movesAvailable) {
            this.soundFX.playDefeat();
            return;
        }

        if (newState.status.checked) {
            this.soundFX.playCheck();
            return;
        }

        if (move.type === "castleLong" || move.type === "castleShort") {
            this.soundFX.playCastle();
            return;
        }

        if (move.type === "enpassant") {
            this.soundFX.playCapture();
            return;
        }

        if (move.type === "promote") {
            this.soundFX.playPromote();
            return;
        }

        // Basic move sounds

        if (move.type !== "move") {
            return;
        }

        let destinationPiece = PieceSelector.getPiece(oldState.board, oldState.pieces, move.payload.destination);

        if (destinationPiece === null) {
            this.soundFX.playMove();
            return;
        }

        if (destinationPiece !== null) {
            this.soundFX.playCapture();
            return;
        }


    }
}
