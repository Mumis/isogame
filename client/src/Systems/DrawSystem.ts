import { Drawable } from '../Components/Drawable';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

export class DrawSystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Drawable);
    }

    public update(dt: number, game: Game): void {
        game.ctx.imageSmoothingEnabled = false;
        game.ctx.clearRect(0, 0, game.ctx.canvas.clientWidth, game.ctx.canvas.clientHeight);

        const orderedFilteredEntities = [...this.filteredEntities].sort((a, b) => { 
            const aFloored = a.position;
            const bFloored = b.position;
            
            // 1. Compare by zIndex (ascending)
            if (a.zIndex !== b.zIndex) {
                return a.zIndex - b.zIndex; 
            }
        
            // 2. If zIndex is the same, compare by z position (descending, to draw further objects first)
            if (bFloored.z !== aFloored.z) {
                return bFloored.z - aFloored.z;
            }
        
            // 3. If z position is the same, compare by y position (ascending, so lower objects are drawn first)
            if (aFloored.y !== bFloored.y) {
                return aFloored.y - bFloored.y;
            }
        
            // 4. If both z and y positions are the same, compare by x position (ascending)
            return aFloored.x - bFloored.x;
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

            entity.draw(game, dt, drawable.opacity);
        }
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
