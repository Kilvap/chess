import { GameScreenAction } from '../ScreenActions';
import { useGameContext } from '../../Context/Game/GameContext';
import { useScreenContext } from '../../Context/ScreenContext';
import { ReplayGameAction } from '../../Context/Game/GameContextActions';

import styles from './../Screen.module.scss';
import { CHECKMATE, TIME, STALEMATE } from '../../Helpers/GameStatus';

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

function ResultSubHeading(gameResult) {

    if (gameResult.type === CHECKMATE) {
        return <div className={styles.subMessage}> Checkmate </div>;
    }

    if (gameResult.type === TIME) {
        return <div className={styles.subMessage}> Time </div>;
    }

    return null;
}

function VictoryHeading(result) {
    return (
        <div className={styles.heading}>
            <div className={styles.message}> Victory! </div>
            <ResultSubHeading {...result} />
        </div>
    )
}

function DefeatHeading(result) {
    return (
        <div className={styles.heading}>
            <div className={styles.message}> Defeat </div>
            <ResultSubHeading {...result} />
        </div>
    )
}

function StalemateHeading() {
    return (
        <div className={styles.heading}>
            <div className={styles.message}> Stalemate </div>
        </div>
    )
}

function Heading(state) {

    let { game: { status: { result: gameResult } } } = state;

    if (gameResult.winner === state.game.meta.userIndex) {
        return <VictoryHeading {...gameResult} />
    } else if (gameResult.winner === null && gameResult.type === STALEMATE) {
        return <StalemateHeading {...gameResult} />
    } else {
        return <DefeatHeading {...gameResult} />
    }
}

export default function GameOverScreen(props) {

    let { setGameContext } = useGameContext();
    let { setScreenState } = useScreenContext();

    return (
        <div className={styles.overlayContainer}>

            <div className={styles.overlayIsland}>

                <Heading {...props} />

                <div className={styles.button} onClick={ PlayAgain(setGameContext, setScreenState) }>
                    Play again
                </div>

                <div className={styles.button} onClick={ ShowBoard(setScreenState) }>
                    Show board
                </div>
            </div>
        </div>
    )
}
