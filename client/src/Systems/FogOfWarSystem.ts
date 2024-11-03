import { Drawable } from '../Components/Drawable';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
import { System } from './System';

export class FogOfWarSystem extends System {
    private lastCameraPosition: Vector3 | null = null;

    public constructor() {
        super();
    }

    public initialize(game: Game): void {
    }
    
    public appliesTo(entity: Entity): boolean {
        return true;
    }

    public update(dt: number, game: Game): void {
        const cameraPosition = game.cameraPosition.floor();
        
        if (this.lastCameraPosition !== null && this.lastCameraPosition.x === cameraPosition.x && this.lastCameraPosition.z === cameraPosition.z) return;

        this.lastCameraPosition = cameraPosition;        

        const radius = 11;
        
        for (const entity of this.filteredEntities) {
            const inRadius = isPointInCircle(entity.position.x, entity.position.z, cameraPosition.x, cameraPosition.z, radius);

            const drawable = entity.hasComponent(Drawable) ? entity.getComponent(Drawable) : null;

            // if (drawable?.fadeIn || drawable?.fadeOut) return;

            if (inRadius && !drawable) {
                entity.addComponent(new Drawable(true));
            }
            
            if (!inRadius && drawable) {
                drawable.fadeOut = true;
                drawable.fadeIn = false;
            }
        }
    }  
}

function isPointInCircle(x: number, y: number, cx: number, cy: number, radius: number) {
    const distanceSquared = (x - cx) ** 2 + (y - cy) ** 2;
    return distanceSquared <= radius ** 2;
}