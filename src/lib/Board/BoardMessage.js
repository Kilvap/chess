
import { useEffect, useState } from 'react';
import styles from './BoardMessage.module.scss';
import GameStatus from '../Helpers/GameStatus';

import { useGameContext } from '../Context/Game/GameContext';
import { ReplayGameAction } from '../Context/Game/GameContextActions';

function getClassNames(props) {
    let classes = [styles.boardMessage];

    if (GameStatus.gameWon(props.status, props.userIndex, props.turn)) {
        classes.push(styles.winner);
    }

    return classes.join(" ");
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

function Message(props) {

    if (GameStatus.gameWon(props.status, props.userIndex, props.turn)) {
        return <VictoryMessage />;
    }

    if (GameStatus.gameLost(props.status, props.userIndex, props.turn)) {
        return <DefeatMessage />;
    }

    if (GameStatus.staleMate(props.status)) {
        return <StalemateMessage />;
    }
}

export default function BoardMessage (props) {

    let { setGameContext } = useGameContext();

    let [visible, setVisible] = useState(false);

    let clickShowBoard = () => {
        setVisible(false);
    }

    let clickPlayAgain = () => {
        setGameContext(ReplayGameAction());
    }

    useEffect(() => {
        if (GameStatus.gameOver(props.status)) {
            setVisible(true);
        }
    }, [props.status])

    return (
        <>
        { visible && <div className={getClassNames(props)}>
                <Message {...props} />
                <div className={styles.controls}>
                    <div className={styles.button} onClick={clickPlayAgain}> Play Again </div>
                    <div className={styles.button} onClick={clickShowBoard}> Show Board </div>
                </div>
            </div>
        }
        </>
    )
}
