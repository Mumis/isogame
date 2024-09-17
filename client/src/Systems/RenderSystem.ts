import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

export class RenderSystem extends System {
    private readonly bufferCanvas: HTMLCanvasElement = document.createElement('canvas');
    private readonly bufferCtx: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d')!;

    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return true;
    }

    public update(dt: number, game: Game): void {
        this.bufferCanvas.height = game.ctx.canvas.clientHeight;
        this.bufferCanvas.width = game.ctx.canvas.clientWidth;
        this.bufferCtx.imageSmoothingEnabled = false;

        // Calculate the camera offsets to center the view
        const cameraX = game.cameraPos[0] - this.bufferCanvas.width / 2;
        const cameraY = game.cameraPos[1] - this.bufferCanvas.height / 2;

        // Set up the transformation: translate to the camera position
        this.bufferCtx.transform(1, 0, 0, 1, -cameraX, -cameraY);

        const orderedFilteredEntities = this.filteredEntities.sort((a, b) => {
            // Compare by zIndex first
            if (a.zIndex !== b.zIndex) {
                return a.zIndex - b.zIndex; // Ascending by zIndex (use b.zIndex - a.zIndex for descending)
            }
            // If zIndex is the same, compare by y position (position[1])
            return a.position[1] - b.position[1]; // Ascending by y position
        });

        // Draw all filtered entities
        for (const entity of orderedFilteredEntities) {
            entity.draw(this.bufferCtx, dt);
        }

        // Clear the main canvas and draw the buffer canvas onto it
        game.ctx.clearRect(0, 0, game.ctx.canvas.clientWidth, game.ctx.canvas.clientHeight);
        game.ctx.drawImage(this.bufferCanvas, 0, 0);
    }
}
