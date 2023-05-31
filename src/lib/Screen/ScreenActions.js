
// Screens
export const HOME = "Home";
export const GAME = "Game";
export const GAMETYPE = "GameType";
export const GAMEOVER = "GameOver";

// Events
export const OVERLAY = "Overlay";
export const TRANSITION = "Transition";

export function HomeScreenAction() {
    return { type: HOME };
}

export function GameScreenAction() {
    return { type: GAME };
}

export function GameTypeScreenAction() {
    return { type: GAMETYPE };
}

export function GameOverScreenAction(payload) {
    return { type: GAMEOVER, payload };
}

export function ScreenTransitionAction(payload) {
    return { type: TRANSITION, payload };
}

export function OverlayScreenAction(payload) {
    return { type: OVERLAY, payload };
}