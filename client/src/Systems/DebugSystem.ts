import { Drawable } from '../Components/Drawable';
import { Collidable, CubeHitbox } from '../Components/Collidable';
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
        return entity.hasComponent(Drawable);
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
            if (entity.hasComponent(Collidable) && !(entity instanceof Tile)) {
                const hitbox = entity.getComponent(Collidable);

                if (hitbox.box instanceof CubeHitbox) {
                    drawCube(hitbox.box, this.bufferCtx);
                }
            }

            if (true) {
                drawPoint(
                    Game.worldPosToScreenPos(entity.position),
                    `${entity.position.floor().toString()}`, 
                    'yellow', 
                    this.bufferCtx,
                    2
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

    // const textWidth = ctx.measureText(text).width;
    // const textX = position.x - textWidth / 2;
    // const textZ = position.y + 20;
    // ctx.fillText(text, textX, textZ);
}

function drawCube(box: CubeHitbox, context: CanvasRenderingContext2D) {
        // Get corners in world space
        const corners = box.getCorners();
    
        // Convert each corner to screen coordinates
        const screenCorners = corners.map(corner => Game.worldPosToScreenPos(corner));
    
        // Draw edges for the 3D bounding box in 2D
        context.beginPath();
        
        // Bottom face
        context.moveTo(screenCorners[0].x, screenCorners[0].y);
        context.lineTo(screenCorners[1].x, screenCorners[1].y);
        context.lineTo(screenCorners[2].x, screenCorners[2].y);
        context.lineTo(screenCorners[3].x, screenCorners[3].y);
        context.closePath();  // Close bottom face
    
        // Top face
        context.moveTo(screenCorners[4].x, screenCorners[4].y);
        context.lineTo(screenCorners[5].x, screenCorners[5].y);
        context.lineTo(screenCorners[6].x, screenCorners[6].y);
        context.lineTo(screenCorners[7].x, screenCorners[7].y);
        context.closePath();  // Close top face
    
        // Vertical edges connecting top and bottom faces
        for (let i = 0; i < 4; i++) {
            context.moveTo(screenCorners[i].x, screenCorners[i].y);
            context.lineTo(screenCorners[i + 4].x, screenCorners[i + 4].y);
        }
    
        // Set styling and stroke the lines
        context.strokeStyle = "red";
        context.lineWidth = 1;
        context.stroke();
}

function drawCircle(position: Vector3, w, h, color, ctx: CanvasRenderingContext2D) {
    
}