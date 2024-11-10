import { Abilities } from '../Components/Abilities';
import { Character } from '../Components/Character';
import { Drawable } from '../Components/Drawable';
import { Stats } from '../Components/Stats';
import { Entity } from '../Entities/Entity';    
import { Player } from '../Entities/Player';
import { Game } from '../Game/Game';
import { System } from './System';

export class HudSystem extends System {
    private readonly bufferCanvas: HTMLCanvasElement = document.createElement('canvas');
    private readonly bufferCtx: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d')!;

    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Drawable) &&
            (
                entity.hasComponent(Stats) ||
                entity.hasComponent(Character)
            )
    }

    public update(dt: number, game: Game): void {
        // this.bufferCanvas.height = game.ctx.canvas.clientHeight;
        // this.bufferCanvas.width = game.ctx.canvas.clientWidth;
        const player = this.filteredEntities.find(entity => entity instanceof Player);
        const nonPlayerEntities = this.filteredEntities.filter(entity => !(entity instanceof Player));

        // this.bufferCtx.imageSmoothingEnabled = false;

        // const screenPos = Game.worldPosToScreenPos(game.cameraPosition);

        // Calculate the camera offsets to center the view
        // const cameraX = screenPos.x - this.bufferCanvas.width / 2;
        // const cameraY = screenPos.y - this.bufferCanvas.height / 2;

        // Set up the transformation: translate to the camera position
        // this.bufferCtx.transform(1, 0, 0, 1, -cameraX, -cameraY);

        if (player) {
            drawPlayerOverlay(player, game);
        }

        //drawHealthBars(nonPlayerEntities, game);
        drawCharactersOverlay(nonPlayerEntities, game);

        //game.ctx.drawImage(this.bufferCanvas, 0, 0);
    }
}

function drawCharactersOverlay(entities: Entity[], game: Game): void {
    for (const entity of entities) {
        const screenPos = game.worldPosToScreenPos(entity.position);

        if (entity.hasComponent(Character)) {
            const character = entity.getComponent(Character);

            const width = game.ctx.measureText(character.name).width;
            const x = screenPos.x - width / 2;
            const y = screenPos.y - 20;

            game.ctx.font = '15px Montserrat';

            game.ctx.fillStyle = '#fff';
            game.ctx.lineWidth = 2;
            game.ctx.strokeText(character.name, x, y);
            game.ctx.fillText(character.name, x, y);
        }

        if (entity.hasComponent(Stats)) {
            const stats = entity.getComponent(Stats);

            if (stats.health.current === stats.health.max) continue;

            const width = 40;
            const height = 3;

            const x = screenPos.x - width / 2;
            const y = screenPos.y - 15;

            game.ctx.fillStyle = '#000';
            game.ctx.fillRect(x - 1, y - 1, width + 2, height + 2);

            game.ctx.fillStyle = '#ff0000';
            game.ctx.fillRect(x, y, width * (stats.health.current / stats.health.max), height);
        }
    }
}

function drawPlayerOverlay(player: Player, game: Game): void {
    if (player.hasComponent(Stats)) {
        const stats = player.getComponent(Stats);
    
        const width = game.ctx.canvas.width / 5;
        const height = 20;
        const padding = 10;
    
        const totalBarsHeight = (height * 3) + (padding * 2); // Total height of 3 bars + padding
        const startX = (game.ctx.canvas.width - width) / 2; // Start at the center of the canvas (horizontally)
        const startY = game.ctx.canvas.height - totalBarsHeight - 84; // 20px above the bottom of the screen
    
        // Health bar (red)
        drawBar(
            game.ctx, 
            startX, 
            startY, 
            width, 
            height, 
            stats.health.current / stats.health.max, 
            '#ff0000'
        );
    
        // Mana bar (blue)
        drawBar(
            game.ctx, 
            startX, 
            startY + height + padding, 
            width, height, 
            stats.mana.current / stats.mana.max, 
            '#0000ff'
        );
    
        // Stamina bar (green)
        drawBar(
            game.ctx, 
            startX, 
            startY + (height + padding) * 2, 
            width, 
            height, 
            stats.stamina.current / stats.stamina.max, 
            '#00ff00'
        );
    }

    if (player.hasComponent(Abilities)) {
        const abilities = player.getComponent(Abilities);

        for (let i = 0; i < abilities.maxAmount; i++) {
            const skill = abilities.activeSet[i];
            
            const padding = 10;
            const width = 64;
            const height = 64;
            const totalWidth = (width + padding) * 8;

            game.ctx.fillStyle = '#555';

            const x = (game.ctx.canvas.width - totalWidth) / 2 + (i * (width + padding));
            const y = game.ctx.canvas.height - height - padding;

            game.ctx.fillRect(x, y, width, height);

            if (skill) {
                game.ctx.drawImage(
                    skill.image, 
                    x, 
                    y, 
                    width, 
                    height
                );

                if (skill.timeUntilReady > 0) {
                    game.ctx.font = '20px Montserrat';
                    const textWidth = game.ctx.measureText(Math.ceil(skill.timeUntilReady).toString()).width;


                    const textX = x + width / 2 - textWidth / 2;
                    const textY = y + height / 2;

                    game.ctx.fillStyle = '#fff';
                    game.ctx.fillText(Math.ceil(skill.timeUntilReady).toString(), textX, textY);
                }
            }
        }
    }
}

function drawBar(ctx, x, y, width, height, percentage, color) {
    // Background bar (grey)
    ctx.fillStyle = '#555';
    ctx.fillRect(x, y, width, height);

    // Fill bar based on percentage
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * percentage, height);
}