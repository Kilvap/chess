import constants from "../Helpers/Constants";

export default function createUIReducer(game, gameLogic) {

    return function reducer(state, action) {
        switch (action.type) {

            case "select":
                var validMoves = gameLogic.getValidMoves(game.board, game.pieces, action.payload);
                return { ...state, selection: action.payload, validMoves };
            
            case "deselect":
                return { ...state, selection: null, validMoves: [] };

            case "flipBoard":
                var perspective = state.perspective;

                if (perspective === constants.BLACK) {
                    perspective = constants.WHITE;
                } else {
                    perspective = constants.BLACK;
                }

                return {...state, perspective };

            case "showPromotionDialog":
                var props = action.payload;
                var promotionDialog = { visible: true, ...props };
                return {...state, promotionDialog }

            case "hidePromotionDialog":
                var newPromotionDialog = { visible: false, source: null, destination: null, col: 0, row: 0 };
                return {...state, promotionDialog: newPromotionDialog, selection: null, validMoves: [] };
            
            case "animateMove":
                // action.payload looks like { "move": `A game move`, "complete": `A function to run after animation is complete` }
                return {...state, animate: action.payload };

            case "endMoveAnimation":
                return {...state, animate: null };

            default:
                return state;
        }
    }
}
