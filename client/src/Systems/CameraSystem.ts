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
            game.cameraPos[0] = entity.position[0];
            game.cameraPos[1] = entity.position[1];
        }
    }
}
