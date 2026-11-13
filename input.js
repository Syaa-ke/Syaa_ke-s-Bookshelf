// キーボード(矢印キー)とスマホのスワイプ入力。
// 入力を「意味のあるアクション」に変換して handlers に渡します。
//   handlers.onDirection('up'|'down'|'left'|'right')
//   handlers.onAction()  … 開始 / 再開 / リスタート(Space, Enter, タップ)
//   handlers.onPause()   … 一時停止(P キー)

const KEY_TO_DIR = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export function setupInput(canvas, handlers) {
  window.addEventListener('keydown', (e) => {
    const dir = KEY_TO_DIR[e.key];
    if (dir) {
      e.preventDefault(); // 矢印キーでページがスクロールしないように
      handlers.onDirection(dir);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handlers.onAction();
    } else if (e.key === 'p' || e.key === 'P') {
      handlers.onPause();
    }
  });

  // スワイプ操作(スマホ向け)
  let sx = 0;
  let sy = 0;
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) {
      handlers.onAction(); // タップ
    } else if (Math.abs(dx) > Math.abs(dy)) {
      handlers.onDirection(dx > 0 ? 'right' : 'left');
    } else {
      handlers.onDirection(dy > 0 ? 'down' : 'up');
    }
  }, { passive: false });
}
