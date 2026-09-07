import { playSound } from "./audio";
import { resetRound } from "./state";
import type { GameGui, GameState, PadId } from "./types";
import {
  disablePads,
  formatScore,
  setCounterText,
  setPadCursor,
} from "./ui";

const WIN_SCORE = 20;
const SEQUENCE_STEP_MS = 750;
const BLINK_MS = 250;
const PAD_FEEDBACK_MS = 250;
const PLAYER_TIMEOUT_MS = 5000;

export function createGameEngine(state: GameState, gui: GameGui) {
  const setScore = (): void => {
    setCounterText(gui.counter, formatScore(state.score));
  };

  const blink = (text: string, callback: () => void): void => {
    let counter = 0;
    let on = true;

    setCounterText(gui.counter, text);

    const interval = setInterval(() => {
      if (!state.gameOn) {
        clearInterval(interval);
        gui.counter.classList.remove("gui__counter-on");
        return;
      }

      if (on) {
        gui.counter.classList.remove("gui__counter-on");
      } else {
        gui.counter.classList.add("gui__counter-on");

        if (++counter === 3) {
          clearInterval(interval);
          callback();
        }
      }

      on = !on;
    }, BLINK_MS);
  };

  const waitForPlayerClick = (): void => {
    clearTimeout(state.timeout);

    state.timeout = setTimeout(() => {
      if (!state.playerCanPlay) return;
      disablePads(gui.pads);
      resetOrPlayAgain();
    }, PLAYER_TIMEOUT_MS);
  };

  const playSequence = (): void => {
    let counter = 0;
    let padOn = true;

    state.playerSequence = [];
    state.playerCanPlay = false;
    setPadCursor(gui.pads, "auto");

    const interval = setInterval(() => {
      if (!state.gameOn) {
        clearInterval(interval);
        disablePads(gui.pads);
        return;
      }

      if (padOn) {
        if (counter === state.gameSequence.length) {
          clearInterval(interval);
          disablePads(gui.pads);
          waitForPlayerClick();
          setPadCursor(gui.pads, "pointer");
          state.playerCanPlay = true;
          return;
        }

        const sndId = state.gameSequence[counter];
        const pad = gui.pads[sndId];

        if (sndId === undefined || !pad) {
          clearInterval(interval);
          return;
        }

        playSound(state.sounds, sndId);
        pad.classList.add("game__pad-active");
        counter += 1;
      } else {
        disablePads(gui.pads);
      }

      padOn = !padOn;
    }, SEQUENCE_STEP_MS);
  };

  const startGame = (): void => {
    if (!state.gameOn) return;

    blink("--", () => {
      newColor();
    });
  };

  const newColor = (): void => {
    if (state.score === WIN_SCORE) {
      blink("**", startGame);
      return;
    }

    const nextPad = Math.floor(Math.random() * 4) as PadId;
    state.gameSequence.push(nextPad);
    state.score += 1;
    setScore();
    playSequence();
  };

  const resetOrPlayAgain = (): void => {
    state.playerCanPlay = false;

    if (state.strict) {
      blink("!!", () => {
        state.score = 0;
        state.gameSequence = [];
        startGame();
      });
      return;
    }

    blink("!!", () => {
      setScore();
      playSequence();
    });
  };

  const handlePadClick = (event: Event): void => {
    if (!state.playerCanPlay) return;

    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    const soundId = Array.from(gui.pads).indexOf(target);
    if (soundId < 0) return;

    target.classList.add("game__pad-active");
    playSound(state.sounds, soundId);
    state.playerSequence.push(soundId as PadId);

    setTimeout(() => {
      target.classList.remove("game__pad-active");

      const currentMove = state.playerSequence.length - 1;
      const playerMove = state.playerSequence[currentMove];
      const expectedMove = state.gameSequence[currentMove];

      if (playerMove !== expectedMove) {
        state.playerCanPlay = false;
        disablePads(gui.pads);
        resetOrPlayAgain();
        return;
      }

      if (currentMove === state.gameSequence.length - 1) {
        newColor();
        return;
      }

      waitForPlayerClick();
    }, PAD_FEEDBACK_MS);
  };

  const powerOff = (): void => {
    resetRound(state);
    disablePads(gui.pads);
    setPadCursor(gui.pads, "auto");
    gui.led.classList.remove("gui__led-active");
    setCounterText(gui.counter, "--");
  };

  const bindEvents = (): void => {
    gui.powerSwitch.addEventListener("click", () => {
      state.gameOn = gui.powerSwitch.classList.toggle("gui__btn-switch-on");
      gui.powerSwitch.setAttribute("aria-pressed", String(state.gameOn));
      gui.counter.classList.toggle("gui__counter-on", state.gameOn);

      if (!state.gameOn) {
        powerOff();
        return;
      }

      setCounterText(gui.counter, "--");
    });

    gui.strict.addEventListener("click", () => {
      if (!state.gameOn) return;
      state.strict = gui.led.classList.toggle("gui__led-active");
    });

    gui.start.addEventListener("click", () => {
      startGame();
    });

    gui.pads.forEach((pad) => {
      pad.addEventListener("click", handlePadClick);
    });
  };

  return { bindEvents };
}
