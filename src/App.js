import React, { useEffect, useState } from "react";

import "./App.css";

import Timer from "./Timer";
import Menu from "./Menu";
import PlayerConfig from "./PlayerConfig";

import {
  minutesToSeconds,
  calculateMinimumChanges,
  calcSubs,
  setSubAsMade,
} from "./util";

const App = () => {
  // game config
  const numPeriods = 2;
  const periodLength = minutesToSeconds(2);
  const numPlayersOn = 4;

  const [subsPerChange, setSubsPerChange] = useState(1);
  const [subMultiplier, setSubMultiplier] = useState(1);

  const players = [
    'Alpha',
    'Bravo',
    'Charlie',
    'Delta',
    'Echo'
  ];

  const numPlayers = players.length;

  const gameSettings = {
    numPeriods,
    periodLength,
    numPlayersOn,
    players,
  };

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

  // sub stuff
  const minChanges = calculateMinimumChanges(numPlayers, subsPerChange);
  const minSubEvery = periodLength / minChanges;
  const subEvery = minSubEvery / subMultiplier;
  const numChanges = minChanges * subMultiplier;

  // i should use a reducer here
  const [subs, setSubs] = useState(
    calcSubs(players, numPlayersOn, subEvery, numChanges, subsPerChange)
  );

  const makeSub = (index, on, off) => {
    setPlayersOnField(
      playersOnField.filter((name) => name !== off).concat([on])
    );
    setPlayersOnBench(
      playersOnBench.filter((name) => name !== on).concat([off])
    );
    setSubs(setSubAsMade(subs, index));
  };

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

      
      {screen === "GAME" && (
        <>
          <Timer
            {...{
              clockTime,
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
