import { ScreenTransitionAction, GameScreenAction, HomeScreenAction } from '../ScreenActions';
import { useGameContext } from '../../Context/Game/GameContext';
import { useScreenContext } from '../../Context/ScreenContext';
import { ReplayGameAction } from '../../Context/Game/GameContextActions';

import styles from './../Screen.module.scss';
import { GAMEWON, GAMELOST, GAMESTALEMATE } from '../../Helpers/GameStatus';

function PlayAgain(setGameContext, setScreenState) {
    return () => {
        setGameContext(ReplayGameAction());
        setScreenState(GameScreenAction());
    }
}

function ShowBoard(setScreenState) {
    return () => {
        setScreenState(GameScreenAction());
    }
}

function VictoryMessage() {
    return (
        <div className={styles.message}> Victory! </div>
    )
}

function DefeatMessage() {
    return (
        <div className={styles.message}> Defeat </div>
    )
}

function StalemateMessage() {
    return (
        <div className={styles.message}> Stalemate </div>
    )
}

function GameOverMessage() {
    return (
        <div className={styles.message}> Game Over </div>
    )
}

function Message(props) {

    switch(props.result) {
        case GAMEWON:
            return <VictoryMessage />;
        case GAMELOST:
            return <DefeatMessage />;
        case GAMESTALEMATE:
            return <StalemateMessage />;
        default:
            return <GameOverMessage />;
    }
}

export default function GameOverScreen(props) {

    let { setGameContext } = useGameContext();
    let { setScreenState } = useScreenContext();

    return (
        <div className={styles.overlayContainer}>

            <div className={styles.overlayIsland}>

                <div className={styles.heading}>
                    <Message {...props} />
                </div>

                <div className={styles.button} onClick={ PlayAgain(setGameContext, setScreenState) }>
                    Play again
                </div>

                <div className={styles.button} onClick={ ShowBoard(setScreenState) }>
                    Show board
                </div>

                <div className={styles.button} onClick={ () => {setScreenState(ScreenTransitionAction(HomeScreenAction()))} }>
                    Go home
                </div>
            </div>
        </div>
    )
}
