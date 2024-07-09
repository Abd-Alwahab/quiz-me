const Progress = ({ numQuestions, index, points, maxPoints, answer }) => {
  return (
    <header className="progress">
      <progress value={index + Number(answer !== null)} max={numQuestions} />

      <p>
        Question{" "}
        <strong>
          {index + 1} / {numQuestions}
        </strong>
      </p>

      <p>
        <strong>{points}</strong> / {maxPoints} points
      </p>
    </header>
  );
};

export default Progress;
