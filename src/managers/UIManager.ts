export class UIManager {
  private static instance: UIManager;

  private constructor() {}

  public static getInstance(): UIManager {
    if (!UIManager.instance) {
      UIManager.instance = new UIManager();
    }
    return UIManager.instance;
  }

  public showGameOverOverlay(score: number, isNewHighscore: boolean): void {
    if (typeof (window as any).showGameOverOverlay === "function") {
      (window as any).showGameOverOverlay(score, isNewHighscore);
    }
  }
}

export const uiManager = UIManager.getInstance();
