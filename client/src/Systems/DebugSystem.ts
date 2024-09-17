import { BoxHitbox, Hitbox } from '../Components/Hitbox';
import { Entity } from '../Entities/Entity';    
import { Tile } from '../Entities/Tile';
import { Game } from '../Game/Game';
import { System } from './System';

export class DebugSystem extends System {
    private div = document.createElement('div');

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
        const cameraX = game.cameraPos[0] - game.ctx.canvas.width / 2;
        const cameraY = game.cameraPos[1] - game.ctx.canvas.height / 2;
        for (const entity of this.filteredEntities) {

            if (entity.hasComponent(Hitbox)) {
                // TODO: 
                // Change so it draws the hitbox, not the width and height of entity

                const hitbox = entity.getComponent(Hitbox);

                if (hitbox.box instanceof BoxHitbox) {
                    drawBox(
                        entity.position[0] - cameraX, 
                        entity.position[1] - cameraY, 
                        hitbox.box.width, 
                        hitbox.box.depth, 
                        'green', 
                        game.ctx
                    );
                }

            }

            if (!(entity instanceof Tile)) {
                drawPoint(
                    entity.position[0] - cameraX, 
                    entity.position[1] - cameraY, 
                    `[${Math.floor(entity.position[0])}, ${Math.floor(entity.position[1])}, ${Math.floor(entity.position[2])}]`, 
                    'yellow', 
                    game.ctx,
                    10
                );
            }
        }

        // Show FPS
        this.div.innerHTML = `
            FPS: ${Math.floor(game.fps)} <br/>
            Camera position: [${Math.floor(game.cameraPos[0])}, ${Math.floor(game.cameraPos[1])}]
        `;
    }
}

function drawPoint(drawX: number, drawY: number, text: string, color: string, ctx: CanvasRenderingContext2D, size = 4) {
    ctx.fillStyle = color;
    ctx.fillRect(drawX - size/2, drawY - size/2, size, size);
    ctx.fillStyle = color;

    const textWidth = ctx.measureText(text).width;
    const textX = drawX - textWidth / 2;
    const textY = drawY + 20;
    ctx.fillText(text, textX, textY);
}

function drawBox(x, y, w, h, color, ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2; // Set the line width, adjust as needed

    ctx.strokeRect(x - w/2, y-h, w, h);
}