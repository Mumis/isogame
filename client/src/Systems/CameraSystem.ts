import { Entity } from '../Entities/Entity';    
import { Player } from '../Entities/Player';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
import { System } from './System';

export class CameraSystem extends System {
    private targetPosition: Vector3 | null = null;

    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity instanceof Player;
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities) {
            if (!this.targetPosition) {
                game.cameraPosition = entity.position;
                this.targetPosition = game.cameraPosition;
                return;
            }
            
            this.targetPosition = entity.position;

            game.cameraPosition = new Vector3(
                lerp(game.cameraPosition.x, this.targetPosition.x, 0.08),
                lerp(game.cameraPosition.y, this.targetPosition.y, 0.08),
                lerp(game.cameraPosition.z, this.targetPosition.z, 0.08),
            );
        }
    }
}

function lerp(start: number, end: number, t: number) {
    return start + (end - start) * t;
}
