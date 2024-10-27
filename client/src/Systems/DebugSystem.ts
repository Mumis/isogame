import { BoxHitbox, Hitbox } from '../Components/Hitbox';
import { Entity } from '../Entities/Entity';    
import { Tile } from '../Entities/Tile';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
import { System } from './System';

export class DebugSystem extends System {
    private div = document.createElement('div');
    private readonly bufferCanvas: HTMLCanvasElement = document.createElement('canvas');
    private readonly bufferCtx: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d')!;

    public constructor() {
        super();

        document.body.appendChild(this.div);

        this.div.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 10px;
            border-radius: 5px;
            max-width: 300px;
            color: white;
        `;
    }
    
    public appliesTo(entity: Entity): boolean {
        return true;
    }

    public update(dt: number, game: Game): void {
        this.bufferCanvas.height = game.ctx.canvas.clientHeight;
        this.bufferCanvas.width = game.ctx.canvas.clientWidth;
        this.bufferCtx.imageSmoothingEnabled = false;

        const screenPos = Game.worldPosToScreenPos(game.cameraPosition);

        // Calculate the camera offsets to center the view
        const cameraX = screenPos.x - this.bufferCanvas.width / 2;
        const cameraY = screenPos.y - this.bufferCanvas.height / 2;

        // Set up the transformation: translate to the camera position
        this.bufferCtx.transform(1, 0, 0, 1, -cameraX, -cameraY);

        for (const entity of this.filteredEntities) {
            const screenPos = Game.worldPosToScreenPos(entity.position);

            if (entity.hasComponent(Hitbox)) {
                const hitbox = entity.getComponent(Hitbox);

                if (hitbox.box instanceof BoxHitbox) {
                    drawBox(
                        new Vector3(screenPos.x - entity.width/2, screenPos.y - entity.height, 0), 
                        hitbox.box.width, 
                        hitbox.box.depth, 
                        'green', 
                        this.bufferCtx
                    );
                }

            }

            if (!(entity instanceof Tile)) {
                drawPoint(
                    screenPos,
                    `${entity.position.floor().toString()}`, 
                    'yellow', 
                    this.bufferCtx,
                    10
                );
            }
        }

        // Show FPS
        this.div.innerHTML = `
            FPS: ${Math.floor(game.fps)} <br/>
            Camera position: ${game.cameraPosition.floor().toString()}
        `;

        game.ctx.drawImage(this.bufferCanvas, 0, 0);
    }
}

function drawPoint(position: Vector3, text: string, color: string, ctx: CanvasRenderingContext2D, size = 4) {
    ctx.fillStyle = color;
    ctx.fillRect(position.x - size/2, position.y - size/2, size, size);
    ctx.fillStyle = color;

    const textWidth = ctx.measureText(text).width;
    const textX = position.x - textWidth / 2;
    const textZ = position.y + 20;
    ctx.fillText(text, textX, textZ);
}

function drawBox(position: Vector3, w, h, color, ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.strokeRect(position.x, position.y, w, h);
}

function drawCircle(position: Vector3, w, h, color, ctx: CanvasRenderingContext2D) {
    
}