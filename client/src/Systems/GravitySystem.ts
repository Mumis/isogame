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

            // Apply gravity to vertical velocity
            physical.velocity.y -= (physical.acceleration * physical.mass) / 100;
        }
    }
}
