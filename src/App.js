import React, { useEffect, useState } from 'react';

import './App.css';
import Timer from './Timer.js';


// minutes to seconds
const seconds = (minutes) => minutes * 60;



const App = () => {

  // game settings
  const numPeriods = 2;
  const periodLength = seconds(20);
  const numPlayersOn = 4;
  const minutesPerChange = 4;
  
  // players
  const players = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
  
  // game state
  const currentPeriod = 1;
  const [clockTime, setClockTime] = useState(() => 0);
  const [clockRunning, setClockRunning] = useState(() => false);  
  
  // helpers
  const toggleClock = () => setClockRunning(!clockRunning);
  const resetClock = () => setClockTime(0);
  const clockTick = () => setClockTime((previous) => previous + 1);
    
  // if the clock's running, tick it up once a second
  useEffect(() => {
    if (!clockRunning) return;
    const timer = setInterval(clockTick, 1000);      
    return () => clearInterval(timer);
  },[clockRunning]);


  return (
    <div className="App">
      <Timer {...{clockTime, periodLength, clockRunning, toggleClock, resetClock}} />      
    </div>
  );
};

export default App;
