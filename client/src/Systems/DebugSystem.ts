import { BoxHitbox, Hitbox } from '../Components/Hitbox';
import { Entity } from '../Entities/Entity';    
import { Tile } from '../Entities/Tile';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
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
        const cameraX = game.cameraPosition.x - game.ctx.canvas.width / 2;
        const cameraY = game.cameraPosition.z - game.ctx.canvas.height / 2;

        for (const entity of this.filteredEntities) {

            if (entity.hasComponent(Hitbox)) {
                // TODO: 
                // Change so it draws the hitbox, not the width and height of entity

                const hitbox = entity.getComponent(Hitbox);

                // if (hitbox.box instanceof BoxHitbox) {
                //     drawBox(
                //         entity.position[0] * Game.TILE_SIZE_WIDTH - cameraX, 
                //         entity.position[1] * Game.TILE_SIZE_HEIGHT - cameraY, 
                //         hitbox.box.width, 
                //         hitbox.box.depth, 
                //         'green', 
                //         game.ctx
                //     );
                // }

            }

            if (!(entity instanceof Tile)) {
                drawPoint(
                    game.positionInCamera(entity.position),
                    `${Game.screenPosToWorldPos(entity.position).floor().toString()}`, 
                    'yellow', 
                    game.ctx,
                    10
                );
            }
        }

        // Show FPS
        this.div.innerHTML = `
            FPS: ${Math.floor(game.fps)} <br/>
            Camera position: ${Game.screenPosToWorldPos(game.cameraPosition).floor().toString()}
        `;
    }
}

function drawPoint(position: Vector3, text: string, color: string, ctx: CanvasRenderingContext2D, size = 4) {
    ctx.fillStyle = color;
    ctx.fillRect(position.x - size/2, position.z - size/2, size, size);
    ctx.fillStyle = color;

    const textWidth = ctx.measureText(text).width;
    const textX = position.x - textWidth / 2;
    const textZ = position.z + 20;
    ctx.fillText(text, textX, textZ);
}

function drawBox(x, y, w, h, color, ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2; // Set the line width, adjust as needed

    ctx.strokeRect(x - w/2, y-h, w, h);
}