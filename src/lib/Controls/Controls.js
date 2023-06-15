
import { FlipBoardAction } from '../UI/UIActions';
import { useScreenContext } from '../Context/ScreenContext';
import { useGameContext } from '../Context/Game/GameContext';

import { ScreenTransitionAction, HomeScreenAction } from '../Screen/ScreenActions';
import { ReplayGameAction } from '../Context/Game/GameContextActions';


import HomeIcon from '../Icons/Home';
import SwapVerticalIcon from '../Icons/SwapVertical';
import ForfeitIcon from '../Icons/Forfeit';

import styles from './Controls.module.scss';


function ForfeitButton() {

    let { setGameContext } = useGameContext();

    let handleClick = () => {
        setGameContext(ReplayGameAction());
    }

    return (
        <div className={styles.button} onClick={handleClick}>
            <ForfeitIcon/>
        </div>
    )
}

function SwapBoardButton(props) {
    let { updateUI } = props;
    
    let handleClick = () => {
        updateUI(FlipBoardAction());
    }

    return (
        <div className={styles.button} onClick={handleClick}>
            <SwapVerticalIcon/>
        </div>
    )
}

function HomeButton() {

    let { setScreenState } = useScreenContext();

    let handleClick = () => {
        setScreenState(ScreenTransitionAction(HomeScreenAction()));
    }

    return (
        <div className={styles.button} onClick={handleClick}>
            <HomeIcon/>
        </div>
    )
}

export default function Controls(props) {

    return (
        <div className={styles.container}>
            <ForfeitButton />
            <SwapBoardButton updateUI={props.updateUI} />
            <HomeButton />
        </div>
    )
}
