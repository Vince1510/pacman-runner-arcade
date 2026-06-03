document.addEventListener("DOMContentLoaded", () => {
  const btnFullscreen = document.getElementById(
    "btn-fullscreen",
  ) as HTMLButtonElement;
  const btnText = document.querySelector(
    "#btn-fullscreen span",
  ) as HTMLSpanElement;
  const btnJump = document.getElementById("btn-jump") as HTMLDivElement;
  const btnDuck = document.getElementById("btn-duck") as HTMLDivElement;
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

  btnFullscreen.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if (screen.orientation?.lock) {
          await screen.orientation.lock("landscape");
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen/Orientation fout:", err);
    }
  });

  document.addEventListener("fullscreenchange", () => {
    const isFullscreen = !!document.fullscreenElement;
    btnFullscreen.classList.toggle("is-fullscreen", isFullscreen);
    btnText.textContent = isFullscreen
      ? "Exit Fullscreen"
      : "Fullscreen Landscape";
  });

  const getPlayer = () => (window as any).player;

  btnJump.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (getPlayer()) getPlayer().isMobileJumping = true;
  });
  btnJump.addEventListener("touchend", (e) => e.preventDefault());

  btnDuck.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (getPlayer()) getPlayer().isMobileDucking = true;
  });
  btnDuck.addEventListener("touchend", (e) => {
    e.preventDefault();
    if (getPlayer()) getPlayer().isMobileDucking = false;
  });

  (window as any).showGameOverOverlay = (
    score: number,
    isNewHighscore: boolean,
  ) => {
    finalScoreVal.textContent = score.toString().padStart(4, "0");
    newHighscoreBadge.style.display = isNewHighscore ? "inline-block" : "none";
    gameOverOverlay.classList.add("active");
  };

  btnRetry.addEventListener("click", () => window.location.reload());
});
