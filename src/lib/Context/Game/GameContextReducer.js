import { NEW_COMPUTER_GAME, NEW_FRIEND_GAME, REPLAY_GAME } from "./GameContextActions";

import GameLogic from '../../GameLogic/GameLogic';
import UIPlayer from '../../Players/UIPlayer';
import BotPlayer from '../../Players/BotPlayer';
import { buildInitialGameState } from '../../Game/GameState';
import constants from '../../Helpers/Constants';

export function reducer(state, action) {
    switch(action.type) {
        case NEW_COMPUTER_GAME:
            var newGame = buildPlayerVSComputerGameContext();
            var newGameId = state.gameId + 1
            return {...state, ...newGame, gameId: newGameId };

        case NEW_FRIEND_GAME:
            var newGame = buildPlayerVSFriendGameContext();
            var newGameId = state.gameId + 1
            return {...state, ...newGame, gameId: newGameId };

        case REPLAY_GAME:
            var newGameId = state.gameId + 1
            return {...state, gameId: newGameId };

        default:
            return state;
    }
}

export function buildPlayerVSComputerGameContext() {

    let gameLogic = new GameLogic();
    let engine = new Worker(process.env.PUBLIC_URL + "/stockfish11.min.js");
    let agents = [new UIPlayer(), new BotPlayer(gameLogic, engine)];
    let side = constants.WHITE;

    // pick a random side for the player
    if(Math.floor(Math.random() * 10) > 5) {
        side = constants.BLACK;
    }

    let initialGameState = buildInitialGameState(side);

    return { gameLogic, agents, initialGameState };
}

export function buildPlayerVSFriendGameContext() {
    let gameLogic = new GameLogic();
    let agents = [new UIPlayer(), new UIPlayer()];
    let initialGameState = buildInitialGameState(constants.WHITE);

    return { gameLogic, agents, initialGameState };
} 

export function buildComputerVsComputerGameContext() {

    let gameLogic = new GameLogic();
    let engine = new Worker(process.env.PUBLIC_URL + "/stockfish11.min.js");
    let agents = [new BotPlayer(gameLogic, engine), new BotPlayer(gameLogic, engine)];
    let initialGameState = buildInitialGameState(constants.WHITE);

    return { gameLogic, agents, initialGameState };
}
