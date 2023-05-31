import { createContext, useContext, useReducer } from "react";
import screenReducer from "../Screen/ScreenReducer";
import initialScreenState from "../Screen/ScreenState";

export const ScreenContext = createContext({ screenState: null, setScreenState: () => {} });

export function ScreenContextProvider(props) {

    const [screenState, setScreenState] = useReducer(screenReducer, initialScreenState);

    return (
        <ScreenContext.Provider value={{screenState, setScreenState}}>
            { props.children }
        </ScreenContext.Provider>
    );
}

export function useScreenContext() {
    return useContext(ScreenContext);
}
