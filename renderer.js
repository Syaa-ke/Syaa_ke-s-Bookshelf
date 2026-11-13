// Canvas への描画だけを担当。ゲームの状態は読むだけで変更しません。

export class Renderer {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.cfg = config;
    this.ctx = canvas.getContext('2d');
    this.size = config.gridSize * config.cellPx;

    // 高解像度ディスプレイでもくっきり表示
    const dpr = window.devicePixelRatio || 1;
    canvas.width = this.size * dpr;
    canvas.height = this.size * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw(game, overlayLines = []) {
    const { ctx, cfg } = this;
    const c = cfg.cellPx;

    // 盤面(市松模様)
    for (let y = 0; y < cfg.gridSize; y++) {
      for (let x = 0; x < cfg.gridSize; x++) {
        ctx.fillStyle = (x + y) % 2 ? cfg.colors.boardA : cfg.colors.boardB;
        ctx.fillRect(x * c, y * c, c, c);
      }
    }

    // リンゴ
    if (game.apple) {
      ctx.fillStyle = cfg.colors.apple;
      ctx.beginPath();
      ctx.arc((game.apple.x + 0.5) * c, (game.apple.y + 0.5) * c, c * 0.38, 0, Math.PI * 2);
      ctx.fill();
    }

    // スネーク(尾から描いて頭を最前面に)
    for (let i = game.snake.length - 1; i >= 0; i--) {
      const s = game.snake[i];
      ctx.fillStyle = i === 0 ? cfg.colors.snakeHead : cfg.colors.snakeBody;
      this.roundRect(s.x * c + 2, s.y * c + 2, c - 4, c - 4, 6);
    }

    // 中央のメッセージ
    if (overlayLines.length) {
      ctx.fillStyle = cfg.colors.overlay;
      ctx.fillRect(0, 0, this.size, this.size);
      ctx.fillStyle = cfg.colors.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const startY = this.size / 2 - ((overlayLines.length - 1) * 18);
      overlayLines.forEach((line, i) => {
        ctx.font = `${i === 0 ? 'bold 30px' : '18px'} system-ui, sans-serif`;
        ctx.fillText(line, this.size / 2, startY + i * 36);
      });
    }
  }

  roundRect(x, y, w, h, r) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  }
}
