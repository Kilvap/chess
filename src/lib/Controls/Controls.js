
import { FlipBoardAction } from '../UI/UIActions';
import HomeIcon from '../Icons/Home';
import SwapVerticalIcon from '../Icons/SwapVertical';
import styles from './Controls.module.scss';
import { useScreenContext } from '../Context/ScreenContext';
import { ScreenTransitionAction, HomeScreenAction } from '../Screen/ScreenActions';


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
            <HomeButton />
            <SwapBoardButton updateUI={props.updateUI} />
        </div>
    )
}
