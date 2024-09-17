import { Stats } from '../Components/Stats';
import { Entity } from '../Entities/Entity';    
import { Player } from '../Entities/Player';
import { Game } from '../Game/Game';
import { System } from './System';

export class HudSystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity instanceof Player;
    }

    public update(dt: number, game: Game): void {
        const player = this.filteredEntities[0];

        if (player) {
            drawHud(player, game.ctx);
        }
    }
}


function drawHud(player: Player, ctx: CanvasRenderingContext2D): void {
    if (!player.hasComponent(Stats)) return;

    const stats = player.getComponent(Stats);

    // HUD settings
    const barWidth = ctx.canvas.width / 5; // Width of each bar
    const barHeight = 20; // Height of each bar
    const barPadding = 10; // Padding between bars

    const totalBarsHeight = (barHeight * 3) + (barPadding * 2); // Total height of 3 bars + padding
    const startX = (ctx.canvas.width - barWidth) / 2; // Start at the center of the canvas (horizontally)
    const startY = ctx.canvas.height - totalBarsHeight - 20; // 20px above the bottom of the screen

    // Health bar (red)
    drawBar(
        ctx, 
        startX, 
        startY, 
        barWidth, 
        barHeight, 
        stats.health.current / stats.health.max, 
        '#D77D7D'
    );

    // Mana bar (blue)
    drawBar(
        ctx, 
        startX, 
        startY + barHeight + barPadding, 
        barWidth, barHeight, 
        stats.mana.current / stats.mana.max, 
        '#6C8FC0'
    );

    // Stamina bar (green)
    drawBar(
        ctx, 
        startX, 
        startY + (barHeight + barPadding) * 2, 
        barWidth, 
        barHeight, 
        stats.stamina.current / stats.stamina.max, 
        '#7F9C77'
    );
}

function drawBar(ctx, x, y, width, height, percentage, color) {
    // Background bar (grey)
    ctx.fillStyle = '#555';
    ctx.fillRect(x, y, width, height);

    // Fill bar based on percentage
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * percentage, height);
}