import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const colors = ["red", "green", "blue", "yellow", "black"];

const RandomColor = () => {
  return colors[Math.floor(Math.random() * 5)];
};

const GameColors = () => {
  const meaningWord = RandomColor();
  const inkWord = RandomColor();
  const inkColor = Math.random() < 0.4 ? meaningWord : RandomColor();

  return {
    meaningWord,
    inkWord,
    inkColor,
    match: meaningWord === inkColor
  };
};

class Game extends React.Component {
  state = {
    gameStatus: "start", //start, playing, correct ,wrong, done
    remainingSeconds: 15,
    score: 0
  };
  colorValues = GameColors();

  startGame = () => {
    this.setState({ gameStatus: "playing", score: 0 }, () => {
      this.intervalId = setInterval(() => {
        this.setState(prevState => {
          const newRemainingSeconds = prevState.remainingSeconds - 1;
          if (newRemainingSeconds === 0) {
            clearInterval(this.intervalId);
            return {
              gameStatus: "done",
              remainingSeconds: 15
            };
          }
          return {
            gameStatus: "playing",
            remainingSeconds: newRemainingSeconds
          };
        });
      }, 1000);
    });
  };

  handleClick = yesClick => {
    this.setState(prevState => {
      if (prevState.gameStatus === "start") {
        this.startGame();
        this.resetGameAfterDelay();
      }
      if (prevState.gameStatus !== "playing") {
        return null;
      }
      const correctClick = (this.colorValues.match ^ yesClick) === 0;
      const newScore = correctClick ? prevState.score + 1 : prevState.score;
      return {
        gameStatus: correctClick ? "correct" : "wrong",
        score: newScore
      };
    }, this.resetGameAfterDelay());
  };

  resetGameAfterDelay = props => {
    setTimeout(() => {
      this.colorValues = GameColors();
      this.setState({
        gameStatus: "playing"
      });
    }, 500);
  };

  render() {
    const { meaningWord, inkWord, inkColor } = this.colorValues;

    const { gameStatus, remainingSeconds, score } = this.state;

    return (
      <div className="App">
        {gameStatus !== "done" && (
          <div className="rules">
            <h4>
              Does the meaning of the top word match the ink color of the bottom
              word?
            </h4>
          </div>
        )}

        {gameStatus === "start" && (
          <button id="startButton" onClick={this.startGame}>
            Start
          </button>
        )}

        {(gameStatus === "playing" ||
          gameStatus === "correct" ||
          gameStatus === "wrong") && (
          <div className="body">
            <div className={`game-status status-${gameStatus}`} />

            <div className="meaning">{meaningWord}</div>

            <div className="colorWord" style={{ color: inkColor }}>
              {inkWord}
            </div>

            <div className="buttonDiv">
              <button onClick={() => this.handleClick(true)}> YES </button>
              <button onClick={() => this.handleClick(false)}> NO </button>
            </div>
          </div>
        )}
        {gameStatus === "done" && (
          <div className="doneBox">
            <div className="score">
              <i className="fa fa-trophy" /> {score}
            </div>

            <button id="playAgain" onClick={this.startGame}>
              Play Again
            </button>
          </div>
        )}
        <div className="footer">
          {(gameStatus === "playing" ||
            gameStatus === "correct" ||
            gameStatus === "wrong") && (
            <div id="box">
              <div className="timer">
                <i className="fa fa-hourglass-end" /> {remainingSeconds}
              </div>
              <div className="score">
                <i className="fa fa-trophy" /> {score}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
