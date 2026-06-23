document.addEventListener("DOMContentLoaded", () => {
  const gameOverOverlay = document.getElementById(
    "game-over-overlay",
  ) as HTMLDivElement;
  const finalScoreVal = document.getElementById(
    "final-score-val",
  ) as HTMLSpanElement;
  const newHighscoreBadge = document.getElementById(
    "new-highscore-badge",
  ) as HTMLDivElement;
  const btnRetry = document.getElementById("btn-retry") as HTMLButtonElement;

  (window as any).showGameOverOverlay = (
    score: number,
    isNewHighscore: boolean,
  ) => {
    finalScoreVal.textContent = score.toString().padStart(4, "0");
    newHighscoreBadge.style.display = isNewHighscore ? "inline-block" : "none";
    gameOverOverlay.classList.add("active");

    const btnSpan = btnRetry.querySelector("span");
    if (btnSpan) btnSpan.textContent = `Press any button to retry`;
  };

  btnRetry.addEventListener("click", () => window.location.reload());
});
