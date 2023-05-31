import { HOME } from "./ScreenActions";

const state = {
    type: HOME,
    overlay: null, // { type: "GameOver", payload: {...props} }
    nextScreen: [], // A queue of screen actions
};

export default state;
