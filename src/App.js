import React, { useState } from "react";
import '@fontsource/inter';

import "./App.css";

import Menu from "./Menu";
import PlayerConfig from "./PlayerConfig";
import GameConfig from "./GameConfig";
import SubConfig from "./SubConfig";
import ResetConfig from "./ResetConfig";
import Game from "./Game";
import ErrorBoundary from "./ErrorBoundary";
import Sounds from './Sounds';
import Palette from './Palette';

const App = () => {
  const [route, navigateTo] = useState("GAME");

  const [subRoute, setSubRoute] = useState(null);

  return (
    <div className="App">
      <ErrorBoundary>
        <Menu
          navigateTo={navigateTo}
          route={route}
          subRoute={subRoute}
          setSubRoute={setSubRoute}
        />
        {route === "PLAYERS" && <PlayerConfig />}
        {route === "GAME SETTINGS" && <GameConfig />}
        {route === "SUB SETTINGS" && <SubConfig navigateTo={navigateTo} />}
        {route === "RESET" && <ResetConfig />}
        {route === "GAME" && <Game subRoute={subRoute} setSubRoute={setSubRoute} />}
        {route === "SOUNDS" && <Sounds />}
        {route === "PALETTE" && <Palette />}
      </ErrorBoundary>
    </div>
  );
};

export default App;
