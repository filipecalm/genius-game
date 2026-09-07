import type { CursorType, GameGui } from "./types";

export function queryGui(): GameGui {
  const counter = document.querySelector<HTMLElement>(".gui__counter");
  const powerSwitch = document.querySelector<HTMLElement>(".gui__btn-switch");
  const led = document.querySelector<HTMLElement>(".gui__led");
  const strict = document.querySelector<HTMLElement>(".gui__btn-strict");
  const start = document.querySelector<HTMLElement>(".gui__btn-start");
  const pads = document.querySelectorAll<HTMLElement>(".game__pad");

  if (!counter || !powerSwitch || !led || !strict || !start || pads.length !== 4) {
    throw new Error("Game UI elements are missing from the DOM.");
  }

  return { counter, powerSwitch, led, strict, start, pads };
}

export function setPadCursor(pads: NodeListOf<HTMLElement>, cursor: CursorType): void {
  pads.forEach((pad) => {
    pad.style.cursor = cursor;
  });
}

export function disablePads(pads: NodeListOf<HTMLElement>): void {
  pads.forEach((pad) => {
    pad.classList.remove("game__pad-active");
  });
}

export function formatScore(score: number): string {
  return score.toString().padStart(2, "0");
}

export function setCounterText(counter: HTMLElement, text: string): void {
  counter.textContent = text;
}
