import React from 'react';
import './styles.scss';

import {
  MdCasino,
  MdDirectionsRun,
  MdFreeBreakfast,
  MdSentimentSatisfied,
  MdTimer,
  MdTimerOff
} from 'react-icons/md';

class Countdown extends React.Component {
  constructor() {
    super();

    this.initialState = {
      time: 0,
      minutes: 0,
      seconds: 0,
      temporaryTime: '',
      startCountdownDisabled: true,
      countdownIsActive: false,
      countdownEnd: false,
      countdownCanceled: false,
    };

    this.state = this.initialState;

    this.countdownTimeout = null;

    this.goBack = this.goBack.bind(this);
    this.handleInputTime = this.handleInputTime.bind(this);
    this.customInterval = this.customInterval.bind(this);
    this.shortInterval = this.shortInterval.bind(this);
    this.regularInterval = this.regularInterval.bind(this);
    this.longInterval = this.longInterval.bind(this);
    this.randomInterval = this.randomInterval.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.cancelCountdown = this.cancelCountdown.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.time !== this.state.time) {
      this.setMinutesAndSeconds();
      if (this.state.time > 0) this.startCountdown();
      else if (!this.state.countdownCanceled) {
        this.setState({ countdownIsActive: false, countdownEnd: true });
        new Audio('notification.mp3').play();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.countdownTimeout);
  }

  goBack() {
    this.setState({ countdownEnd: false, countdownIsActive: false });
  }

  handleInputTime({ target }) {
    const temporaryTime = target.value;

    const timePattern = /^([1-5][0-9]|[1-9])m\s([1-5][0-9]|[1-9])+s$|^([1-5][0-9]|[1-9])(m|s)$/g;

    this.setState({
      temporaryTime: target.value,
      startCountdownDisabled: !temporaryTime.match(timePattern),
    });
  }

  startCountdown() {
    const { time } = this.state;
    clearTimeout(this.countdownTimeout);
    this.countdownTimeout = setTimeout(() => {
      this.setState({
        ...this.initialState,
        time: time - 1,
        countdownIsActive: true,
        countdownEnd: false,
      });
    }, 1000);
  }

  cancelCountdown() {
    clearTimeout(this.countdownTimeout);
    this.setState({ time: 0, countdownIsActive: false, countdownCanceled: true });
  }

  setMinutesAndSeconds() {
    const { time } = this.state;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    this.setState({ minutes, seconds });
  }

  customInterval(event) {
    event.preventDefault();

    let { temporaryTime } = this.state;

    temporaryTime = temporaryTime.split(/\s/);

    let seconds = 0;

    temporaryTime.forEach((unit) => {
      if (unit.includes('m')) {
        const temporaryMinutes = unit.replace('m', '');
        const minutesInSeconds = Math.floor(temporaryMinutes * 60);
        seconds += minutesInSeconds;
      } else {
        let temporarySeconds = unit.replace('s', '');
        temporarySeconds = temporarySeconds % 60;
        seconds += temporarySeconds;
      }
    });

    this.setState({
      time: seconds,
      temporaryTime: '',
      startCountdownDisabled: true,
      countdownIsActive: true
    });
  }

  shortInterval() {
    const time = 4 * 60;

    this.setState({ time, countdownIsActive: true });
  }

  regularInterval() {
    const time = 6 * 60;

    this.setState({ time, countdownIsActive: true });
  }

  longInterval() {
    const time = 10 * 60;

    this.setState({ time, countdownIsActive: true });
  }

  randomInterval() {
    const min = Math.ceil(30);
    const max = Math.floor(180);
    const time = Math.floor(Math.random() * (max - min + 1) + min);

    this.setState({ time, countdownIsActive: true });
  }

  render() {
    const {
      minutes,
      seconds,
      startCountdownDisabled,
      temporaryTime,
      countdownIsActive,
      countdownEnd,
      countdownCanceled
    } = this.state;
    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0');

    return (
      <div id="countdown" data-testid="countdown">
        <div className="timer">
          <div className="minutes">
            <span className="minuteLeft">{minuteLeft}</span>
            <span className="minuteRight">{minuteRight}</span>
          </div>
          <span>:</span>
          <div className="seconds">
            <span className="secondLeft">{secondLeft}</span>
            <span className="secondRight">{secondRight}</span>
          </div>
        </div>
        { countdownIsActive ? (
          <button onClick={this.cancelCountdown}>
            <MdTimerOff />
              Cancelar countdown
          </button>
        ) : (
          <>
            <form className="customInterval" onSubmit={this.customInterval}>
              <input type="text" value={temporaryTime} spellCheck={false} placeholder="Ex.: 3m 25s" onChange={this.handleInputTime} />
              <button type="submit" disabled={startCountdownDisabled}>
                <MdTimer />
                  Iniciar countdown
              </button>
            </form>
        
            <div className="options">
              <button onClick={this.shortInterval}>
                <MdDirectionsRun />
                  Vamos rápido, já voltamos
              </button>
              <button onClick={this.regularInterval}>
                <MdFreeBreakfast />
                  Voltamos em breve
              </button>
              <button onClick={this.longInterval}>
                <MdSentimentSatisfied />
                  Só alegria
              </button>
              <button onClick={this.randomInterval}>
                <MdCasino />
                  Aleatório
              </button>
            </div>
          </>
        ) }
        { (countdownEnd && !countdownCanceled) && (
          <div id="countdownEndMessage" data-testid="countdownEndMessage">
            <strong><div className="tada">🎉️</div>Tempo finalizado!</strong>
            <button onClick={this.goBack}>Voltar</button>
          </div>
        ) }
      </div>
    );
  }
}

export default Countdown;
