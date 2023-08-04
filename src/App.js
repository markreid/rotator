import React, { useState } from "react";

import "./App.css";

import Menu from "./Menu";
import PlayerConfig from "./PlayerConfig";
import GameConfig from "./GameConfig";
import SubConfig from "./SubConfig";
import ResetConfig from './ResetConfig';
import Game from "./Game";
import ErrorBoundary from './ErrorBoundary';


const App = () => {
  
  const [route, navigateTo] = useState("GAME");


  return (
    <div className="App">
      <ErrorBoundary>
        <Menu navigateTo={navigateTo} route={route} />
        {route === "PLAYERS" && <PlayerConfig />}
        {route === "GAME SETTINGS" && <GameConfig />}
        {route === "SUB SETTINGS" && <SubConfig navigateTo={navigateTo} />}
        {route === "RESET" && <ResetConfig />}
        {route === "GAME" && <Game />}
      </ErrorBoundary>
    </div>
  );
};

export default App;
