import { Movable } from '../Components/Movable';
import { Physical } from '../Components/Physical';
import { Entity, EntityDirection } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

export class VelocitySystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Physical);
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities) {
            const physical = entity.getComponent(Physical);
            
            let extraX = 0;
            let extraY = 0;

            if (entity.hasComponent(Movable)) {
                const movable = entity.getComponent(Movable);

                extraX += movable.vector[0];
                extraY += movable.vector[1];

                if (movable.vector[0] !== 0 || movable.vector[1] !== 0) {
                    entity.direction = getDirection(movable.vector[0], movable.vector[1]);
                }
            }

            const x = extraX + physical.velocity[0] * dt;
            const y = extraY + physical.velocity[1] * dt;
            const z = physical.velocity[2] * dt;
            
            entity.position[0] += x;   
            entity.position[1] += y;
            entity.position[2] += z;
        }
    }
}

function getDirection(x: number, y: number) {
    if (Math.abs(x) > Math.abs(y)) {
        return x > 0 ? EntityDirection.E : EntityDirection.W;
    } else {
        return y > 0 ? EntityDirection.S : EntityDirection.N;
    }
}