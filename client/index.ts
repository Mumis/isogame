import './index.scss';
import { Game } from './src/Game/Game';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const game = new Game(ctx, "");

game.start();
