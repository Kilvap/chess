export const GAMEWON = "Won";
export const GAMELOST = "Lost";
export const GAMESTALEMATE = "Stalemate";

// Game status state
export const STATE_ACTIVE = "Active";
export const STATE_COMPLETED = "Completed";

export function initialGameStatus() {
    return { state: STATE_ACTIVE, checked: false, movesAvailable: true, result: null };
}

// Game result types
export const CHECKMATE = "Checkmate";
export const STALEMATE = "Stalemate";
export const TIME = "Time";

export function gameResult(winner, type) {
    return { winner, type };
}

function opponent(playerIndex) {
    return ((playerIndex + 1) % 2);
}

export function buildGameStatus(turn, movesAvailable, checked) {

    if (movesAvailable === false && checked === true) {
        return { state: STATE_COMPLETED, movesAvailable, checked, result: gameResult(opponent(turn), CHECKMATE) };
    }

    if (movesAvailable === false && checked === false) {
        return { state: STATE_COMPLETED, movesAvailable, checked, result: gameResult(null, STALEMATE) };
    }

    return { state: STATE_ACTIVE, movesAvailable, checked, result: null };
}

// time ran out on playerIndex, opponent won
export function buildTimeRunOutGameStatus(oldStatus, playerIndex) {
    return { state: STATE_COMPLETED, movesAvailable: oldStatus.movesAvailable, checked: oldStatus.checked, result: gameResult(opponent(playerIndex), TIME)};
}

// export default class GameStatus {

//     static gameWon(status, playerIndex, turn) {
//         return (status.movesAvailable === false && status.checked === true && turn !== playerIndex);
//     }

//     static gameLost(status, playerIndex, turn) {
//         return (status.movesAvailable === false && status.checked === true && turn === playerIndex);
//     }

//     static staleMate(status) {
//         return (status.movesAvailable === false && status.checked === false);
//     }

//     static gameActive(status) {
//         return status.movesAvailable === true;
//     }

//     static gameOver(status) {
//         return status.movesAvailable === false;
//     }

//     static gameResult(status, userIndex, turn) {

//         if (GameStatus.gameWon(status, userIndex, turn)) {
//             return GAMEWON;
//         }

//         if (GameStatus.gameLost(status, userIndex, turn)) {
//             return GAMELOST;
//         }
 
//         if (GameStatus.staleMate(status)) {
//             return GAMESTALEMATE;
//         }
//     }

//     static gameResult2(winner, type) {
//         return { winner, type };
//     }

//     static initialGameStatus() {
//         return { state: STATE_ACTIVE, checked: false, movesAvailable: true, result: null };
//     }

//     static nextGameStatus(checked, movesAvailable, playerIndex, turn) {

//         let status = GameStatus.initialGameStatus();
        
//         status.checked = checked;
//         status.movesAvailable = movesAvailable;

//         return status;
//     }
// }
