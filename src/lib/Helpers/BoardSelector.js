export default class BoardSelector {

    static originalPerspective(meta) {
        let userIndex = meta.userIndex;
        return meta.players[userIndex].side;
    }
}
