import React, { useEffect, useState } from "react";

import "./App.css";

import Timer from "./Timer";
import Menu from "./Menu";
import PlayerConfig from "./PlayerConfig";
import GameConfig from "./GameConfig";

import {
  minutesToSeconds,
  getConfig,
} from "./util";

const App = () => {
  
  const [{
    numPlayersOn,
    periodLengthMinutes,
    numPeriods,
  }, setGameSettings] = useState({});

  const periodLength = minutesToSeconds(periodLengthMinutes);

  const [configReady, setConfigReady] = useState(false);
  const [reloadConfigKey, reloadConfigTrigger] = useState(Math.random()); 
  const reloadConfig = () => reloadConfigTrigger(Math.random());

  useEffect(() => {
    setGameSettings(getConfig('gameSettings', {}));
    setConfigReady(true);
  
    // todo - if there are no game settings set some key to show 
    // that we're doing a fresh load
  

  }, [reloadConfigKey]);

  // game state
  const currentPeriod = 1;
  const [clockTime, setClockTime] = useState(() => 0);
  const [clockRunning, setClockRunning] = useState(() => true);

  
  // app state
  const [screen, setScreen] = useState("GAME");

  // helpers
  const toggleClock = () => setClockRunning(!clockRunning);
  const resetClock = () => {
    setClockTime(0);
    setClockRunning(false);
  };

  // if the clock's running, tick it up once a second
  useEffect(() => {
    if (!clockRunning) return;
    const clockTick = () =>
      setClockTime((previous) => Math.min(periodLength, previous + 1));
    const timer = setInterval(clockTick, 1000);
    return () => clearInterval(timer);
  }, [clockRunning, periodLength]);


  // if the config hasn't loaded don't try and render anything
  if (!configReady) return null;
    
  return (
    <div className="App">
      <Menu screen={screen} setScreen={setScreen} />

      {screen === "PLAYERS" && <PlayerConfig />}

      {screen === "GAME SETTINGS" && <GameConfig />}
      
      {screen === "GAME" && (
        <>
          <Timer
            {...{
              clockTime,
              currentPeriod,
              numPeriods,
              periodLength,
              clockRunning,
              toggleClock,
              resetClock,
            }}
          />
          
        </>
      )}
    </div>
  );
};

export default App;
