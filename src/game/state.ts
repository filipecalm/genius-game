import type { GameState } from "./types";

export function createGameState(): GameState {
  return {
    gameOn: false,
    timeout: undefined,
    sounds: [],
    strict: false,
    playerCanPlay: false,
    score: 0,
    gameSequence: [],
    playerSequence: [],
  };
}

export function resetRound(state: GameState): void {
  state.strict = false;
  state.playerCanPlay = false;
  state.score = 0;
  state.gameSequence = [];
  state.playerSequence = [];
}
