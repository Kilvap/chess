import { useEffect, useReducer } from 'react';

import { ApplyMoveAction } from './GameActions.js';
import createGameReducer from './GameReducer.js';

import Layout from '../Layout/Layout.js';
import Board from '../Board/Board.js';
// import EvaluationBar from '../EvaluationBar/EvaluationBar.js';

import { STATE_COMPLETED } from '../Helpers/GameStatus.js';
import createUIReducer from '../UI/UIReducer.js';
import buildUIState from '../UI/UIState';
import { AnimateMove } from '../UI/UIActions';
import { useGameContext } from '../Context/Game/GameContext.js';
import { useScreenContext } from '../Context/ScreenContext.js';
import { GameOverScreenAction, OverlayScreenAction } from '../Screen/ScreenActions.js';

// Runs once every turn. Obtains a move from a player and applies it if it's a 
// valid move. Runs until the game is over.
async function moveLoop(game, agents, gameLogic, updateGame, updateUI) {
    
    if (game.status.state === STATE_COMPLETED) {
        return;
    }

    // Resolved moves are wrapped around within an object with an animate property.
    do {
        var move = await agents[game.turn].getMove(game);
    } while(!gameLogic.isValidMove(game, move.payload));

    if (move.animate) {
        updateUI(AnimateMove(move.payload, () => {updateGame(ApplyMoveAction(move.payload))} ));
    } else {
        updateGame(ApplyMoveAction(move.payload));
    }
}
 
export default function Game() {
    
    // Read game context
    let { setScreenState } = useScreenContext();
    let { gameContext: { gameLogic, agents, initialGameState } } = useGameContext();

    // States
    const [game, updateGame] = useReducer(createGameReducer(gameLogic), initialGameState);
    const [ui, updateUI] = useReducer(createUIReducer(game, gameLogic), buildUIState(game));

    useEffect(() => {
        moveLoop(game, agents, gameLogic, updateGame, updateUI);
    }, [game, agents, gameLogic, updateGame, updateUI]);

    useEffect(() => {
        if (game.status.state === STATE_COMPLETED) {
            setScreenState(OverlayScreenAction(GameOverScreenAction({ game })));
        }
    }, [game, setScreenState])

    return (
        <Layout game={game} ui={ui} updateGameState={updateGame} updateUI={updateUI}>

                {/* <EvaluationBar gameState={gameState} engine={engine2} /> */}

                <Board
                    perspective={ui.perspective}
                    selection={ui.selection}
                    validMoves={ui.validMoves}
                    promotionDialog={ui.promotionDialog}
                    animate={ui.animate}

                    board={game.board}
                    pieces={game.pieces}
                    meta={game.meta}
                    turn={game.turn}
                    moves={game.moves}
                    status={game.status}
 
                    players={agents}

                    updateGameState={updateGame}
                    updateUIState={updateUI}
                    gameLogic={gameLogic}
                />

        </Layout>
    );
}
