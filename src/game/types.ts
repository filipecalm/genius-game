export type PadId = 0 | 1 | 2 | 3;

export type CursorType = "auto" | "pointer";

export interface GameState {
  gameOn: boolean;
  timeout: ReturnType<typeof setTimeout> | undefined;
  sounds: HTMLAudioElement[];
  strict: boolean;
  playerCanPlay: boolean;
  score: number;
  gameSequence: PadId[];
  playerSequence: PadId[];
}

export interface GameGui {
  counter: HTMLElement;
  powerSwitch: HTMLElement;
  led: HTMLElement;
  strict: HTMLElement;
  start: HTMLElement;
  pads: NodeListOf<HTMLElement>;
}
