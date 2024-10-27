import { Physical } from '../Components/Physical';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

export class GravitySystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Physical);
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities) {
            const physical = entity.getComponent(Physical);

            if (entity.position.y > 0) {
                // Apply gravity to vertical velocity
                physical.velocity.y -= (physical.acceleration * physical.mass) / 32;
            } else {
                // Ensure the entity doesn't go below the ground
                entity.position.y = 0;
                physical.velocity.y = 0;
            }
        }
    }
    
}
