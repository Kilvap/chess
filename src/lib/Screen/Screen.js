//import HomeScreen from "./Home/HomeScreen";
import GameScreen from "./Game/GameScreen";
//import GameTypeScreen from './GameType/GameTypeScreen';

import { GAMEOVER } from './ScreenActions';
import { GameContextProvider } from "../Context/Game/GameContext";

import styles from './Screen.module.scss';
import { useScreenContext } from "../Context/ScreenContext";
import GameOverScreen from "./GameOver/GameOverScreen";
import Shell from "../Shell/Shell";

function getCurrentOverlay(state) {

    if (!state.overlay) {
        return null;
    }

    switch (state.overlay.type) {
        case GAMEOVER:
            var props = state.overlay.payload;
            return <GameOverScreen {...props} />;
        default: 
            return null;
    }
}

// function getCurrentScreen(state) {

//     switch(state.type) {
//         case HOME:
//             return <HomeScreen />;
//         case GAMETYPE:
//             return <GameTypeScreen />;
//         case GAME:
//             return <GameScreen />;
//         default:
//             return <GameScreen />;
//     }
// }

function getScreens(state) {
    //let screen = getCurrentScreen(state);
    let overlay = getCurrentOverlay(state);

    return [/*screen, */overlay];
}

function handleTransitionEnd(state, setState) {
    return (event) => {

        if (state.nextScreen.length === 0) {
            return;
        }

        if (event.propertyName !== 'opacity') {
            return;
        }

        let nextScreen = state.nextScreen.shift();
        setState(nextScreen);
    }
}

function getClasses(state) {
    let classes = [styles.container];

    if (state.nextScreen.length > 0) {
        classes.push(styles.animation);
    }

    return classes.join(" ");
}

function getMainScreenClasses(state) {

    let classes = [styles.mainArea];

    if (!!state.overlay) {
        classes.push(styles.blurred);
    }

    return classes.join(" ");
}

let navLinks = {
    home: "https://kilvap.github.io",
    info: "https://en.wikipedia.org/wiki/Chess",
    github: "https://github.com/Kilvap/chess"
};

// Handles transitions between screens by exhausting nextScreen
export default function Screen() {

    let { screenState, setScreenState } = useScreenContext();
    let [/*screen,*/ overlay] = getScreens(screenState);

    return (
        <Shell navLinks={navLinks}>
            <GameContextProvider>
                <div className={getClasses(screenState)} onTransitionEnd={handleTransitionEnd(screenState, setScreenState)}>
                    <div className={getMainScreenClasses(screenState)}>
                        <GameScreen /> {/* For now only show the game screen */ }
                    </div>    
                    
                    { overlay }
                </div>
            </GameContextProvider>
        </Shell>
    )
}
