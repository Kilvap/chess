import { memo, useEffect, useState } from "react";

import { STATE_ACTIVE, STATE_COMPLETED, buildTimeRunOutGameStatus } from '../Helpers/GameStatus';
import { SetStatusAction } from '../Game/GameActions';

import constants from "../Helpers/Constants";

import styles from './PlayerInfo.module.scss';

const sideImg = {
    [constants.BLACK]: "/chess/pieces/set1/black-pawn.png",
    [constants.WHITE]: "/chess/pieces/set1/white-pawn.png",
};

function getMinutesString(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    return minutes + ":"+ seconds.toString().padStart(2, '0').substring(0, 2);
}

function Clock(props) {

    let [time, setTime] = useState(props.time);

    useEffect(() => {

        // End the game on time
        if (time <= 0 && props.status.state === STATE_ACTIVE) {
            props.updateGameState(SetStatusAction(buildTimeRunOutGameStatus(props.status, props.playerIndex)));
            return;
        }

        let performTick = (props) => {
            return () => {
                if (props.turn === props.playerIndex) {
                    setTime(time - 1);
                }
            }
        }

        if (props.status.state === STATE_ACTIVE) {
            let intervalId = setInterval(performTick(props), 1000);
            return () => clearInterval(intervalId);
        }

    }, [props, time]);

    return (
        <div>
            { getMinutesString(time) }
        </div>
    )
}

function WinnerBadge() {
    return (
        <div className={styles.winnerBadge}>
            <span className={styles.checkmark}>
                <div className={styles.checkmarkCircle}></div>
                <div className={styles.checkmarkStem}></div>
                <div className={styles.checkmarkKick}></div>
            </span>
        </div> 
    );
}

function getClockClassnames(props) {
    let classes = [styles.playerClock];

    if (props.turn === props.playerIndex && props.status.state === STATE_ACTIVE) {
        classes.push(styles.turn);
    }

    return classes.join(" ");
}

function PlayerInfo(props) {

    let players = props.players;
    let {name, side} = players[props.playerIndex];

    return (
        <div className={styles.playerInfo}>
            <div className={styles.playerImage}>
                <img className={styles.playerImg} width="32" height="32" alt="" src={sideImg[side]}></img>
            </div>

            <div className={styles.playerName}>
                <div className={styles.text}> { name } </div>
            </div>

            { props.status.state === STATE_COMPLETED && props.status.result.winner === props.playerIndex &&
                <WinnerBadge {...props} /> 
            }

            <div className={getClockClassnames(props)}>
                <Clock {...props} />
            </div>
        </div>

    )
}

export default memo(PlayerInfo);
