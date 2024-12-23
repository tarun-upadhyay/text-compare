import React from "react";
import { useTimer } from "react-timer-hook";

export function CountdownTimer({ expiryTimestamp }) {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <div className="text-center">
      <div style={{ fontSize: "100px" }}>
        <span>{hours != 0 && hours} </span>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <div className="flex gap-3">
        <button onClick={start}>Start</button>
        <button
          onClick={() => {
            // Restarts to 5 minutes timer
            const time = new Date();
            time.setSeconds(time.getSeconds() + 300);
            restart(time);
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
