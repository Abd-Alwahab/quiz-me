import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import questions_data from "../data/questions.json";

const initialState = {
  questions: [],
  status: "loading", //"loading" , "ready" , "error", "active", "finished"
  index: 0,
  answer: null,
  points: 0,
  secondeRemaining: null,
};

const SECONDE_PER_QUESTION = 30;

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondeRemaining: state.questions.length * SECONDE_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion": {
      return { ...state, index: state.index + 1, answer: null };
    }
    case "finish":
      return { ...state, status: "finished" };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    case "tick": {
      return {
        ...state,
        secondeRemaining: state.secondeRemaining - 1,
        status: state.secondeRemaining === 0 ? "finished" : state.status,
      };
    }
    default:
      throw new Error(`Unsupported action type ${action.type}`);
  }
};

function App() {
  const [
    { status, questions, index, answer, points, secondeRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const questionsCount = questions.length;
  const maxPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(() => {
    if (questions_data?.questions?.length) {
      dispatch({ type: "dataReceived", payload: questions_data.questions });
    } else {
      dispatch({ type: "dataFailed" });
    }
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen questionsCount={questionsCount} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={questionsCount}
              index={index}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <Footer>
              <Timer dispatch={dispatch} secondRemaining={secondeRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={questionsCount}
                index={index}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <>
            <FinishScreen
              points={points}
              maxPoints={maxPoints}
              dispatch={dispatch}
            />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
