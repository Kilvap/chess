
// coordinates is an array of two elements [row, col]
export function SelectAction(coordinates) {
    return {type: "select", payload: coordinates};
}

export function DeselectAction() {
    return {type: "deselect"};
}

export function FlipBoardAction() {
    return {type: "flipBoard"};
}

export function ShowPromotionDialog(source, destination, row, col) {
    return {type: "showPromotionDialog", payload: {source, destination, row, col} };
}

export function HidePromotionDialog() {
    return {type: "hidePromotionDialog" };
}

export function AnimateMove(move, complete) {
    return {type: "animateMove", payload: {move, complete}};
}

export function EndMoveAnimation() {
    return {type: "endMoveAnimation" };
}
