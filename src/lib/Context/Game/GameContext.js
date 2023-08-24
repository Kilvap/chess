import { createContext, useContext, useReducer } from "react";
import { reducer } from "./GameContextReducer";
import initialState from "./GameContextState";
import { buildPlayerVSComputerGameContext } from "./GameContextReducer";

export const GameContext = createContext({gameContext: null, setGameContext: () => {} });

export function GameContextProvider(props) {

    // For now just initialize with a default game context
    let [gameContext, setGameContext] = useReducer(reducer, {...initialState, ...buildPlayerVSComputerGameContext()});

    return (
        <GameContext.Provider value={{gameContext, setGameContext}}>
            { props.children }
        </GameContext.Provider>
    );
}

// Convience wrapper
export function useGameContext() {
    return useContext(GameContext);
}
