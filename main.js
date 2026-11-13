// 各モジュールをつなぐ入口。ゲームループと画面(スコア表示)の更新を担当。
import { CONFIG } from './config.js';
import { SnakeGame } from './snake.js';
import { Renderer } from './renderer.js';
import { HighScore } from './storage.js';
import { setupInput } from './input.js';

const canvas = document.getElementById('board');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');

const game = new SnakeGame({
  gridSize: CONFIG.gridSize,
  initialLength: CONFIG.initialLength,
});
const renderer = new Renderer(canvas, CONFIG);
const highScore = new HighScore(CONFIG.storageKey);
let best = highScore.load();

function updateHud() {
  scoreEl.textContent = game.score;
  bestEl.textContent = best;
}

function overlayFor(status) {
  switch (status) {
    case 'ready':
      return ['SNAKE', '矢印キー / スワイプで開始'];
    case 'paused':
      return ['一時停止', 'Space / P で再開'];
    case 'over':
      return ['GAME OVER', `スコア: ${game.score}`, 'Space / タップでもう一度'];
    case 'won':
      return ['CLEAR!', 'すべてのマスを埋めました', 'Space / タップでもう一度'];
    default:
      return [];
  }
}

// ゲーム内イベントの受け口。効果音・エフェクト・難易度変化などはここに足していく。
function handleEvent(event) {
  if (event === 'eat' || event === 'won') {
    if (game.score > best) {
      best = game.score;
      highScore.save(best);
    }
  }
  updateHud();
}

function restart() {
  game.reset();
  game.start();
  updateHud();
}

setupInput(canvas, {
  onDirection(dir) {
    if (game.status === 'over' || game.status === 'won') return;
    if (game.status === 'paused') return;
    game.start(); // ready なら開始
    game.turn(dir);
  },
  onAction() {
    if (game.status === 'ready') game.start();
    else if (game.status === 'paused') game.togglePause();
    else if (game.status === 'over' || game.status === 'won') restart();
  },
  onPause() {
    game.togglePause();
  },
});

// タブが隠れたら自動で一時停止
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.status === 'playing') game.togglePause();
});

// ゲームループ: 描画は毎フレーム、移動は tickMs ごと
let last = performance.now();
let acc = 0;
function frame(now) {
  acc += Math.min(now - last, 100);
  last = now;
  while (acc >= CONFIG.tickMs) {
    acc -= CONFIG.tickMs;
    const event = game.step();
    if (event) handleEvent(event);
  }
  renderer.draw(game, overlayFor(game.status));
  requestAnimationFrame(frame);
}

updateHud();
requestAnimationFrame(frame);
