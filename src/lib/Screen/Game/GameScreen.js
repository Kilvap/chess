import { useGameContext } from "../../Context/Game/GameContext";
import Game from "../../Game/Game";

export default function GameScreen() {

    let { gameContext: { gameId } } = useGameContext();

    return (
        <Game key={gameId} />
    );
}

