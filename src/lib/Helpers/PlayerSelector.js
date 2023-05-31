export default class PlayerSelector {

    static userIndex(state) {
        return state.meta.userIndex;
    }

    static opponentIndex(state) {
        return ((state.meta.userIndex + 1) % 2);
    }

    static side(state, playerIndex) {
        return (state.meta.players[playerIndex].side);
    }
}
