
import commonStyles from './../Screen.module.scss';
import styles from './HomeScreen.module.scss';

import { ScreenTransitionAction, GameTypeScreenAction, GameScreenAction } from '../ScreenActions';

import { useGameContext } from '../../Context/Game/GameContext';
import { useScreenContext } from '../../Context/ScreenContext';

import { NewComputerGameAction } from '../../Context/Game/GameContextActions';

export default function HomeScreen() {
    let { setGameContext } = useGameContext();
    let { setScreenState } = useScreenContext();

    // let handleClick = () => {
    //     setScreenState(ScreenTransitionAction(GameTypeScreenAction()));
    // }

    let startGame = () => {
        setGameContext(NewComputerGameAction());
        setScreenState(ScreenTransitionAction(GameScreenAction()));
    }

    return (
        <div className={styles.container}>
            <div className={commonStyles.button} onClick={startGame}> Play </div>
        </div>
    );
}
