export let score: number = 0;
export let speed: number = 0;
export let highscore: number = 0;
export let lives: number = 3;
export let isIntroPlaying: boolean = true;
export let isGameOver: boolean = false;
export let isPowerModeActive: boolean = false;
export let currentDifficulty: "EASY" | "HARD" = "EASY";
export let hasPlayedHighscoreSound: boolean = false;

export let isAwaitingStart: boolean = true;

export function setScore(value: number) {
  score = value;
}
export function setSpeed(value: number) {
  speed = value;
}
export function setHighscore(value: number) {
  highscore = value;
}
export function setLives(value: number) {
  lives = value;
}
export function setIsIntroPlaying(value: boolean) {
  isIntroPlaying = value;
}
export function setIsGameOver(value: boolean) {
  isGameOver = value;
}
export function setIsPowerModeActive(value: boolean) {
  isPowerModeActive = value;
}
export function setCurrentDifficulty(value: "EASY" | "HARD") {
  currentDifficulty = value;
}
export function setHasPlayedHighscoreSound(value: boolean) {
  hasPlayedHighscoreSound = value;
}
export function setIsAwaitingStart(value: boolean) {
  isAwaitingStart = value;
}
