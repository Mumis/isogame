import { Physical } from '../Components/Physical';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
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
            physical.velocity = physical.velocity.subtract(new Vector3(0, physical.acceleration * physical.mass, 0));
        }
    }
}
