// ブラウザの localStorage にハイスコアを保存する。
// プライベートモード等で使えない場合でもゲームが止まらないよう try/catch しています。

export class HighScore {
  constructor(key) {
    this.key = key;
  }

  load() {
    try {
      const n = Number.parseInt(localStorage.getItem(this.key), 10);
      return Number.isFinite(n) && n > 0 ? n : 0;
    } catch {
      return 0;
    }
  }

  save(value) {
    try {
      localStorage.setItem(this.key, String(value));
    } catch {
      /* 保存できなくても無視 */
    }
  }
}
