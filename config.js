// ゲーム全体の設定値。ステージサイズや速度、色はここを変えるだけで調整できます。
export const CONFIG = {
  gridSize: 16,        // ステージの一辺のマス数 (16x16)
  initialLength: 5,    // スネークの初期長さ
  tickMs: 130,         // 何ミリ秒ごとに1マス進むか(小さいほど速い)
  cellPx: 30,          // 描画用の1マスの論理サイズ(px)
  storageKey: 'snake-game:highScore', // ハイスコアの保存キー
  colors: {
    boardA: '#1d2b24',
    boardB: '#22332b',
    snakeHead: '#7CFC9A',
    snakeBody: '#3fbf63',
    apple: '#ff5d5d',
    overlay: 'rgba(0, 0, 0, 0.6)',
    text: '#ffffff',
  },
};
