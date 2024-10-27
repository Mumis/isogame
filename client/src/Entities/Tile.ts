import GrassTile from '../../assets/tiles/grass-iso.png';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';


export class Tile {
    public image: HTMLImageElement = new Image();

    constructor(
        public position: Vector3, 
        public zIndex: number
    ) {
        this.image.src = GrassTile;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const worldPos = Game.worldPosToScreenPos(this.position)

        // Draw the isometric tile image
        ctx.drawImage(
            this.image, 
            worldPos.x, 
            worldPos.z, 
            Game.TILE_SIZE_WIDTH, 
            Game.TILE_SIZE_DEPTH
        );

        const text = `[${this.position.x}, ${this.position.y}, ${this.position.z}]`;
        const textX = worldPos.x + Game.TILE_SIZE_WIDTH/2 - 9;
        const textZ = worldPos.z + Game.TILE_SIZE_DEPTH/2 + 3;
        ctx.fillText(text, textX, textZ);
    }
}