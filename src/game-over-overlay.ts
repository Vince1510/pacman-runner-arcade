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

    let countdown = 4;
    const btnSpan = btnRetry.querySelector("span");
    if (btnSpan) btnSpan.textContent = `Retry in ${countdown}... `;

    if ((window as any).countdownTimer)
      clearInterval((window as any).countdownTimer);
    (window as any).countdownTimer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        if (btnSpan) btnSpan.textContent = `Retry in ${countdown}... `;
      } else {
        clearInterval((window as any).countdownTimer);
        window.location.reload();
      }
    }, 1000);
  };

  btnRetry.addEventListener("click", () => window.location.reload());
});
