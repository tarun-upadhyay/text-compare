import { useState, useEffect } from "react";
import Select from "react-select";

const TimerPicker = ({ compareTexts }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i < 10 ? `0${i}` : `${i}`,
  }));

  const minutesAndSecondsOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i < 10 ? `0${i}` : `${i}`,
  }));

  // Update totalSeconds when hours, minutes, or seconds change
  useEffect(() => {
    setTotalSeconds(hours * 3600 + minutes * 60 + seconds);
  }, [hours, minutes, seconds]);

  // Manage timer logic
  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      const timer = setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup the interval
    } else if (totalSeconds <= 0) {
      if (isRunning) compareTexts();
      setIsRunning(false);
    }
  }, [isRunning, totalSeconds]);

  // Update hours, minutes, and seconds from totalSeconds
  useEffect(() => {
    setHours(Math.floor(totalSeconds / 3600));
    setMinutes(Math.floor((totalSeconds % 3600) / 60));
    setSeconds(totalSeconds % 60);
  }, [totalSeconds]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <div className="flex-col items-center">
      <div className="flex gap-3">
        <div>
          <label>Hours:</label>
          <Select
            options={hoursOptions}
            value={{
              value: hours,
              label: hours < 10 ? `0${hours}` : `${hours}`,
            }}
            onChange={(e) => setHours(e.value)}
            isDisabled={isRunning}
          />
        </div>
        <div>
          <label>Minutes:</label>
          <Select
            options={minutesAndSecondsOptions}
            value={{
              value: minutes,
              label: minutes < 10 ? `0${minutes}` : `${minutes}`,
            }}
            onChange={(e) => setMinutes(e.value)}
            isDisabled={isRunning}
          />
        </div>
        <div>
          <label>Seconds:</label>
          <Select
            options={minutesAndSecondsOptions}
            value={{
              value: seconds,
              label: seconds < 10 ? `0${seconds}` : `${seconds}`,
            }}
            onChange={(e) => setSeconds(e.value)}
            isDisabled={isRunning}
          />
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`${isRunning && "invisible"} text-white bg-green-600`}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="text-white bg-red-600"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default TimerPicker;
