import { Entity } from '../Entities/Entity';    
import { Player } from '../Entities/Player';
import { Game } from '../Game/Game';
import { System } from './System';

export class CameraSystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity instanceof Player;
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities) {
            game.cameraPosition = entity.position;
        }
    }
}
