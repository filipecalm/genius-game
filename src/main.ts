import { loadSounds } from "./game/audio";
import { createGameEngine } from "./game/engine";
import { createGameState } from "./game/state";
import { queryGui } from "./game/ui";
import { initConsent } from "./consent";
import "./styles/main.css";

document.documentElement.style.setProperty("-webkit-tap-highlight-color", "transparent");
document.documentElement.style.setProperty("-webkit-touch-callout", "none");
document.documentElement.style.setProperty("user-select", "none");

const state = createGameState();
state.sounds = loadSounds();

const gui = queryGui();
const engine = createGameEngine(state, gui);
engine.bindEvents();

initConsent();
