
export const NEW_COMPUTER_GAME = "NewComputerGame";
export const NEW_FRIEND_GAME = "NewFriendGame";
export const REPLAY_GAME = "ReplayGame";

export function NewComputerGameAction() {
    return { type: NEW_COMPUTER_GAME };
}

export function NewFriendGameAction() {
    return { type: NEW_FRIEND_GAME };
}

export function ReplayGameAction() {
    return { type: REPLAY_GAME };
}
