import { ScreenContextProvider } from "./lib/Context/ScreenContext";
import Screen from "./lib/Screen/Screen";


function App() {
  return (
    <ScreenContextProvider>
      <Screen />
    </ScreenContextProvider>
  )
}

export default App;
