// ゲームロジック本体。DOMや描画には一切依存しないので、テストや機能追加がしやすい構造です。

export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const isSame = (a, b) => a.x === b.x && a.y === b.y;
const isOpposite = (a, b) => a.x === -b.x && a.y === -b.y;

/**
 * status: 'ready' | 'playing' | 'paused' | 'over' | 'won'
 * step() の戻り値(イベント): 'move' | 'eat' | 'over' | 'won' | null
 *   → 効果音やエフェクトを足したいときはこのイベントを使います。
 */
export class SnakeGame {
  constructor({ gridSize = 16, initialLength = 5, rng = Math.random } = {}) {
    this.gridSize = gridSize;
    this.initialLength = initialLength;
    this.rng = rng;
    this.reset();
  }

  reset() {
    const mid = Math.floor(this.gridSize / 2);
    // 頭が先頭。中央から左へ体が伸びる(右向きで開始)
    this.snake = Array.from({ length: this.initialLength }, (_, i) => ({
      x: mid - i,
      y: mid,
    }));
    this.direction = DIRS.right;
    this.queue = []; // 入力バッファ(素早い連続入力を取りこぼさない)
    this.score = 0; // 食べたリンゴの数
    this.status = 'ready';
    this.apple = null;
    this.spawnApple();
  }

  start() {
    if (this.status === 'ready') this.status = 'playing';
  }

  togglePause() {
    if (this.status === 'playing') this.status = 'paused';
    else if (this.status === 'paused') this.status = 'playing';
  }

  /** 方向入力。'up' | 'down' | 'left' | 'right' */
  turn(name) {
    const dir = DIRS[name];
    if (!dir) return;
    const last = this.queue.length ? this.queue[this.queue.length - 1] : this.direction;
    if (isSame(dir, last) || isOpposite(dir, last)) return; // 同方向・逆走は無視
    if (this.queue.length < 2) this.queue.push(dir);
  }

  /** 1マス進める */
  step() {
    if (this.status !== 'playing') return null;
    if (this.queue.length) this.direction = this.queue.shift();

    const head = this.snake[0];
    const next = { x: head.x + this.direction.x, y: head.y + this.direction.y };

    // 壁
    if (next.x < 0 || next.y < 0 || next.x >= this.gridSize || next.y >= this.gridSize) {
      this.status = 'over';
      return 'over';
    }

    const eating = this.apple !== null && isSame(next, this.apple);
    // 食べないときは尾が動くので、尾のマスへは進入OK
    const body = eating ? this.snake : this.snake.slice(0, -1);
    if (body.some((seg) => isSame(seg, next))) {
      this.status = 'over';
      return 'over';
    }

    this.snake.unshift(next);
    if (!eating) {
      this.snake.pop();
      return 'move';
    }

    this.score += 1;
    this.spawnApple();
    if (this.apple === null) {
      this.status = 'won'; // 盤面が埋まった
      return 'won';
    }
    return 'eat';
  }

  /** スネークと重ならないランダムなマスにリンゴを出す */
  spawnApple() {
    const empty = [];
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        if (!this.snake.some((s) => s.x === x && s.y === y)) empty.push({ x, y });
      }
    }
    this.apple = empty.length ? empty[Math.floor(this.rng() * empty.length)] : null;
  }
}
