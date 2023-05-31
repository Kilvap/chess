
const initialPromotionDialog = {
    visible: false,
    row: 0,
    col: 0,
    source: null, 
    destination: null
};

function getInitialUserPerspective(gameState) {
    let meta = gameState.meta;
    return meta.players[meta.userIndex].side;
}

export default function buildUIState(gameState) {
    return {
        perspective: getInitialUserPerspective(gameState), // perspective of the board, should initially match the perspective of the user
        
        selection: null, // used to track the element we've selected or are dragging
        validMoves: [], // potential valid moves for the selection, it's a list of Move objects
        
        promotionDialog: initialPromotionDialog, 

        animate: null, // a move to animate { move, complete }
    }
}
