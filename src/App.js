import React, { useEffect, useState } from "react";

import "./App.css";

import Timer from "./Timer";
import Menu from "./Menu";
import PlayerConfig from "./PlayerConfig";
import GameConfig from "./GameConfig";
import SubConfig from './SubConfig';

import {
  minutesToSeconds,
  calculateMinimumChanges,
  calcSubs,
  setSubAsMade,
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

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setGameSettings(getConfig('gameSettings', {}));
    setPlayers(getConfig('players', []));
  
    // todo - if there are no game settings set some key to show 
    // that we're doing a fresh load

  }, [reloadConfigKey]);

  
  const numPlayers = players.length;

  // game state
  const currentPeriod = 1;
  const [clockTime, setClockTime] = useState(() => 0);
  const [clockRunning, setClockRunning] = useState(() => true);

  const [playersOnField, setPlayersOnField] = useState(
    players.slice(0, numPlayersOn)
  );
  const [playersOnBench, setPlayersOnBench] = useState(
    players.slice(numPlayersOn)
  );

  // // sub stuff
  // const minChanges = calculateMinimumChanges(numPlayers, subsPerChange);
  // const minSubEvery = periodLength / minChanges;
  // const subEvery = minSubEvery / subMultiplier;
  // const numChanges = minChanges * subMultiplier;

  // // i should use a reducer here
  // const [subs, setSubs] = useState(
  //   calcSubs(players, numPlayersOn, subEvery, numChanges, subsPerChange)
  // );

  // const makeSub = (index, on, off) => {
  //   setPlayersOnField(
  //     playersOnField.filter((name) => name !== off).concat([on])
  //   );
  //   setPlayersOnBench(
  //     playersOnBench.filter((name) => name !== on).concat([off])
  //   );
  //   setSubs(setSubAsMade(subs, index));
  // };

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

  return (
    <div className="App">
      <Menu screen={screen} setScreen={setScreen} />

      {screen === "PLAYERS" && <PlayerConfig />}

      {screen === "GAME SETTINGS" && <GameConfig />}

      {screen === 'SUB SETTINGS' && <SubConfig />}
      
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
