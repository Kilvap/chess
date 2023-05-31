
export default function createGameReducer(gameLogic) {

    return function reducer(state, action) {
        switch (action.type) {
            case "applyMove":
                return gameLogic.applyMove(state, action);
            case "setStatus":
                return gameLogic.setStatus(state, action);
            default:
                return state;
        }
    }

}
