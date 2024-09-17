import { Entity } from './Entity';
import GrassTile from '../../assets/tiles/grass-iso.png';
import { Game } from '../Game/Game';


export class Tile extends Entity {
    public frameHeight: number = Game.TILE_SIZE / 2;
    public frameWidth: number = Game.TILE_SIZE;
    public width: number = Game.TILE_SIZE;
    public height: number = Game.TILE_SIZE / 2;
    public spriteSheet: HTMLImageElement = new Image();

    constructor(
            public position: [number, number, number],
            public zIndex: number
        ) {
        super();
        
        this.castShadow = false;
        this.image.src = GrassTile;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        var tileColumnOffset = 64; // pixels
        var tileRowOffset = 32; // pixels

        var originX = this.width / 2 - 18 * tileColumnOffset / 2;
        var originY = this.height / 2;

        var offX = this.position[0] * tileColumnOffset / 2 + this.position[1] * tileColumnOffset / 2 + originX;
        var offY = this.position[1] * tileRowOffset / 2 - this.position[0] * tileRowOffset / 2 + originY;

        // Draw the isometric tile image
        ctx.drawImage(this.image, offX, offY, tileColumnOffset, tileRowOffset);
    }
}