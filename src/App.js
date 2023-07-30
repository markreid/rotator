import React, { useState } from "react";

import "./App.css";

import Menu from "./Menu";
import PlayerConfig from "./PlayerConfig";
import GameConfig from "./GameConfig";
import SubConfig from "./SubConfig";
import Game from "./Game";

const App = () => {
  
  const [screen, setScreen] = useState("GAME");

  return (
    <div className="App">
      <Menu screen={screen} setScreen={setScreen} />
        {screen === "PLAYERS" && <PlayerConfig />}
        {screen === "GAME SETTINGS" && <GameConfig />}
        {screen === "SUB SETTINGS" && <SubConfig />}
        {screen === "GAME" && <Game />}
    </div>
  );
};

export default App;
