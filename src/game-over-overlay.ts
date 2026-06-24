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

    (window as any).canRetryGameOver = false;

    const btnSpan = btnRetry.querySelector("span");
    if (btnSpan) {
      let timeLeft = 5;
      btnSpan.textContent = `Please wait ${timeLeft}s...`;
      
      const interval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
          btnSpan.textContent = `Please wait ${timeLeft}s...`;
        } else {
          clearInterval(interval);
          btnSpan.textContent = `Press any button to retry`;
          (window as any).canRetryGameOver = true;
        }
      }, 1000);
    } else {
      setTimeout(() => {
        (window as any).canRetryGameOver = true;
      }, 5000);
    }
  };

  btnRetry.addEventListener("click", () => {
    if ((window as any).canRetryGameOver) window.location.reload();
  });
});
