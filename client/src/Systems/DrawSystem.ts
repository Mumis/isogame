import { Drawable } from '../Components/Drawable';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

export class DrawSystem extends System {
    private readonly bufferCanvas: HTMLCanvasElement = document.createElement('canvas');
    private readonly bufferCtx: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d')!;

    public constructor() {
        super();
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

        const orderedFilteredEntities = [...this.filteredEntities].sort((a, b) => {
            const screenPosA = Game.worldPosToScreenPos(a.position);
            const screenPosB = Game.worldPosToScreenPos(b.position);
            
            // Compare by zIndex first
            if (a.zIndex !== b.zIndex) {
                return a.zIndex - b.zIndex; // Ascending by zIndex (use b.zIndex - a.zIndex for descending)
            }
            // If zIndex is the same, compare by z position in descending order
            if (b.position.z !== a.position.z) {
                return b.position.z - a.position.z;
            }
            // If z position is the same, compare by x position in asc order
            return a.position.x - b.position.x;
        });

        for (const entity of orderedFilteredEntities) {
            const drawable = entity.getComponent(Drawable);

            if (drawable.fadeIn) {
                animateDrawableFadeIn(drawable, dt);
            }

            if (drawable.fadeOut) {
                animateDrawableFadeOut(drawable, dt);
            }

            if (drawable.opacity <= 0) {
                entity.removeComponent(drawable)
            }

            entity.draw(this.bufferCtx, dt, drawable.opacity);
        }

        game.ctx.clearRect(0, 0, game.ctx.canvas.clientWidth, game.ctx.canvas.clientHeight);
        game.ctx.drawImage(this.bufferCanvas, 0, 0);
    }
}

function animateDrawableFadeIn(drawable: Drawable, dt: number) {
    drawable.fadeInElapsed += dt;

    drawable.opacity = easeInQuad(drawable.fadeInElapsed, 0, 1, drawable.fadeDuration);

    if (drawable.opacity >= 1) {
        drawable.opacity = 1;
        drawable.fadeInElapsed = drawable.fadeDuration;
        drawable.fadeIn = false;
    }
}

function animateDrawableFadeOut(drawable: Drawable, dt: number) {
    drawable.fadeOutElapsed += dt;
    drawable.opacity = 1 - easeInQuad(drawable.fadeOutElapsed, 0, 1, drawable.fadeDuration);

    if (drawable.opacity <= 0) {
        drawable.opacity = 0;
        drawable.fadeOutElapsed = drawable.fadeDuration;
        drawable.fadeOut = false;
    }
    //drawable.opacity = Math.max(0, drawable.opacity);

    // if (drawable.opacity <= 0) {
    //     drawable.opacity = 0;
    //     drawable.elapsed = drawable.fadeDuration;
    //     drawable.fadeOut = false;
    // }
}

function easeLinear (time: number, start: number, end: number, duration: number) {
    return end * time / duration + start;
}

function easeInQuad (time: number, start: number, end: number, duration: number) {
    return end * (time /= duration) * time + start;
}

function easeOutQuad (time: number, start: number, end: number, duration: number) {
    return -end * (time /= duration) * (time - 2) + start;
}
