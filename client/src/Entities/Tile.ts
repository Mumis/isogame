import GrassTile from '../../assets/tiles/grass-iso.png';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
import { Entity } from './Entity';


export class Tile extends Entity {
    public frameHeight: number = Game.TILE_SIZE_DEPTH;
    public frameWidth: number = Game.TILE_SIZE_WIDTH;
    public width: number = Game.TILE_SIZE_WIDTH;
    public height: number = Game.TILE_SIZE_DEPTH;

    constructor(
        public position: Vector3, 
        public zIndex: number
    ) {
        super();
        this.image.src = GrassTile;
    }

    // draw(ctx: CanvasRenderingContext2D): void {
    //     const screenPos = Game.worldPosToScreenPos(this.position, this.width, this.height)

    //     // Draw the isometric tile image
    //     ctx.drawImage(
    //         this.image, 
    //         screenPos.x, 
    //         screenPos.y, 
    //         this.width, 
    //         this.height
    //     );

    //     const text = `[${this.position.x}, ${this.position.y}, ${this.position.z}]`;
    //     const textX = screenPos.x + Game.TILE_SIZE_WIDTH/2 - 9;
    //     const textZ = screenPos.y + Game.TILE_SIZE_DEPTH/2 + 3;
    //     ctx.fillText(text, textX, textZ);
    // }
}