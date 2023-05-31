
import { HOME, GAME, GAMETYPE, OVERLAY, TRANSITION } from './ScreenActions';

export default function reducer (state, action) {

    switch(action.type) {

        // Screens
        case HOME:
            return { ...state, type: HOME, overlay: null, nextScreen: [] };
        
        case GAME:
            return { ...state, type: GAME, overlay: null, nextScreen: [] };
    
        case GAMETYPE:
            return { ...state, type: GAMETYPE, overlay: null, nextScreen: [] };
        
        case OVERLAY:
            return { ...state, overlay: action.payload, nextScreen: [] };

        case TRANSITION:
            return { ...state, nextScreen: [action.payload] };

        default:
            return state;
    }
}
