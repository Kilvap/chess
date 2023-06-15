import constants from '../Helpers/Constants.js';
import { initialGameStatus } from '../Helpers/GameStatus.js';

// indexes into state.meta.players
const user = 0;
const opponent = 1;

function Rook(playerIndex) {
    return pieceState(constants.ROOK, playerIndex);
}

function Knight(playerIndex) {
    return pieceState(constants.KNIGHT, playerIndex);
}

function Bishop(playerIndex) {
    return pieceState(constants.BISHOP, playerIndex);
}

function Queen(playerIndex) {
    return pieceState(constants.QUEEN, playerIndex);
}

function King(playerIndex) {
    return { owner: playerIndex, type: constants.KING, moves: 0, checked: false };
}

function Pawn(playerIndex) {
    let direction = playerIndex === 0 ? constants.NORTH : constants.SOUTH;
    return { owner: playerIndex, type: constants.PAWN, moves: 0, direction, enpassantEligible: false };
}

export function pieceState(type, playerIndex) {
    return { owner: playerIndex, type: type, moves: 0 };
}

function buildBoardAsWhite() {

    let board = [
        [1, 2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15, 16],
    
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        
        [17, 18, 19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30, 31, 32],
    ];

    let pieces = {
        1: Rook(opponent),
        2: Knight(opponent),
        3: Bishop(opponent),
        4: Queen(opponent),
        5: King(opponent),
        6: Bishop(opponent),
        7: Knight(opponent),
        8: Rook(opponent),
    
         9: Pawn(opponent),
        10: Pawn(opponent),
        11: Pawn(opponent),
        12: Pawn(opponent),
        13: Pawn(opponent),
        14: Pawn(opponent),
        15: Pawn(opponent),
        16: Pawn(opponent),
    
        17: Pawn(user),
        18: Pawn(user),
        19: Pawn(user),
        20: Pawn(user),
        21: Pawn(user),
        22: Pawn(user),
        23: Pawn(user),
        24: Pawn(user),
    
        25: Rook(user),
        26: Knight(user),
        27: Bishop(user),
        28: Queen(user),
        29: King(user),
        30: Bishop(user),
        31: Knight(user),
        32: Rook(user),
    };

    return [board, pieces];
}

function buildBoardAsBlack() {
    
    let board = [
        [1, 2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15, 16],
    
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        
        [17, 18, 19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30, 31, 32],
    ];

    let pieces = {
        1: Rook(opponent),
        2: Knight(opponent),
        3: Bishop(opponent),
        4: King(opponent),
        5: Queen(opponent),
        6: Bishop(opponent),
        7: Knight(opponent),
        8: Rook(opponent),
    
         9: Pawn(opponent),
        10: Pawn(opponent),
        11: Pawn(opponent),
        12: Pawn(opponent),
        13: Pawn(opponent),
        14: Pawn(opponent),
        15: Pawn(opponent),
        16: Pawn(opponent),
    
        17: Pawn(user),
        18: Pawn(user),
        19: Pawn(user),
        20: Pawn(user),
        21: Pawn(user),
        22: Pawn(user),
        23: Pawn(user),
        24: Pawn(user),
    
        25: Rook(user),
        26: Knight(user),
        27: Bishop(user),
        28: King(user),
        29: Queen(user),
        30: Bishop(user),
        31: Knight(user),
        32: Rook(user),
    };

    return [board, pieces];
}

function getBoard(playerSide) {
    if (playerSide === constants.WHITE) {
        return buildBoardAsWhite();
    } else {
        return buildBoardAsBlack();
    }
}

function getPlayers(playerSide) {
    if (playerSide === constants.WHITE) {
        return [{name: "You", side: constants.WHITE}, {name: "Opponent", side: constants.BLACK}];
    } else {
        return [{name: "You", side: constants.BLACK}, {name: "Opponent", side: constants.WHITE}];
    }
}

function getTurn(playerSide) {
    if (playerSide === constants.WHITE) {
        return 0
    } else {
        return 1;
    }
}

export function buildInitialGameState(playerSide) {

    let initialMetaState = {
        players: getPlayers(playerSide),
        userIndex: 0, // index of the user
        time: 300, // how much time to put on the clocks to start the game, in seconds
    };

    let [initialBoard, initialPieces] = getBoard(playerSide);

    return {
        // static stuff that doesn't change
        meta: initialMetaState,
    
        // game state stuff
        board: initialBoard,
        pieces: initialPieces,

        turn: getTurn(playerSide),
        moves: [], // list of PerformedMoves
        status: initialGameStatus(),
    };
}
