import { useEffect } from "react";

const Timer = ({ dispatch, secondRemaining }) => {
  const mints = Math.floor(secondRemaining / 60);
  const seconds = secondRemaining % 60;

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondRemaining, dispatch]);

  return (
    <div className="timer">
      {mints < 10 ? "0" : ""}
      {mints}:{seconds < 10 ? "0" : ""}
      {seconds}
    </div>
  );
};

export default Timer;
