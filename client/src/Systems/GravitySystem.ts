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

            if (entity.position[2] > 0) {
                // Apply gravity to vertical velocity
                physical.velocity[2] -= physical.acceleration * physical.mass;
            } else {
                // Ensure the entity doesn't go below the ground
                entity.position[2] = 0;
                physical.velocity[2] = 0;
            }
        }
    }
    
}
