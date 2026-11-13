// 実行: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { SnakeGame } from '../js/snake.js';

const make = (rng) => new SnakeGame({ gridSize: 16, initialLength: 5, rng });

test('初期状態: 長さ5、リンゴ1個、体と重ならない', () => {
  const g = make();
  assert.equal(g.snake.length, 5);
  assert.ok(g.apple);
  assert.ok(!g.snake.some((s) => s.x === g.apple.x && s.y === g.apple.y));
});

test('移動すると頭が進み、長さは変わらない', () => {
  const g = make();
  g.apple = { x: 0, y: 0 };
  g.start();
  const head = { ...g.snake[0] };
  assert.equal(g.step(), 'move');
  assert.equal(g.snake[0].x, head.x + 1);
  assert.equal(g.snake.length, 5);
});

test('リンゴを食べると伸びて、リンゴが再出現し、スコア+1', () => {
  const g = make();
  g.start();
  const h = g.snake[0];
  g.apple = { x: h.x + 1, y: h.y };
  assert.equal(g.step(), 'eat');
  assert.equal(g.snake.length, 6);
  assert.equal(g.score, 1);
  assert.ok(g.apple);
  assert.ok(!g.snake.some((s) => s.x === g.apple.x && s.y === g.apple.y));
});

test('壁に当たるとゲームオーバー', () => {
  const g = make();
  g.apple = { x: 0, y: 0 };
  g.start();
  let ev;
  for (let i = 0; i < 20 && g.status === 'playing'; i++) ev = g.step();
  assert.equal(ev, 'over');
  assert.equal(g.status, 'over');
});

test('逆方向への入力は無視される', () => {
  const g = make();
  g.apple = { x: 0, y: 0 };
  g.start();
  g.turn('left');
  g.step();
  assert.equal(g.direction.x, 1);
  assert.equal(g.status, 'playing');
});

test('自分の体に当たるとゲームオーバー', () => {
  const g = make();
  g.apple = { x: 0, y: 0 };
  g.start();
  // 上→左→下 と小さく回ると体に衝突する(長さ5なら4手で衝突)
  g.turn('up'); g.step();
  g.turn('left'); g.step();
  g.turn('down'); g.step();
  assert.equal(g.status, 'over');
});

test('リセットで初期状態に戻る', () => {
  const g = make();
  g.start();
  g.step();
  g.reset();
  assert.equal(g.status, 'ready');
  assert.equal(g.snake.length, 5);
  assert.equal(g.score, 0);
});
