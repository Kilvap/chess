// Game status state
export const STATE_PREGAME = "Pregame";
export const STATE_ACTIVE = "Active";
export const STATE_COMPLETED = "Completed";

export function initialGameStatus() {
    return { state: STATE_PREGAME, checked: false, movesAvailable: true, result: null };
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

// called after the first move of the game
export function buildActiveGameStatus() {
    return { state: STATE_ACTIVE, checked: false, movesAvailable: true, result: null };
}