import { ScreenTransitionAction, GameScreenAction } from './../ScreenActions';
import { useGameContext } from '../../Context/Game/GameContext';
import { useScreenContext } from '../../Context/ScreenContext';
import { NewComputerGameAction, NewFriendGameAction } from '../../Context/Game/GameContextActions';

import styles from './../Screen.module.scss';

export default function GameTypeScreen() {

    let { setGameContext } = useGameContext();
    let { setScreenState } = useScreenContext();

    let StartGame = (contextBuilder) => {
        return () => {
            setGameContext(contextBuilder());
            setScreenState(ScreenTransitionAction(GameScreenAction()));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.button} onClick={StartGame(NewFriendGameAction)}>
                Friend
            </div>
            <div className={styles.button} onClick={StartGame(NewComputerGameAction)}>
                Computer
            </div>
        </div>
    )
}
