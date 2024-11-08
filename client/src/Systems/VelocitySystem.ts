import { Movable } from '../Components/Movable';
import { Physical } from '../Components/Physical';
import { Entity, EntityDirection } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
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
            let extraZ = 0;

            if (entity.hasComponent(Movable)) {
                const movable = entity.getComponent(Movable);

                extraX += movable.velocity.x;
                extraY += movable.velocity.y;
                extraZ += movable.velocity.z;

                if (movable.velocity.x !== 0 || movable.velocity.z !== 0) {
                    entity.direction = getDirection(movable.velocity.x, movable.velocity.z);
                }
            }

            const x = extraX + physical.velocity.x;
            const z = extraZ + physical.velocity.z;
            const y = extraY + physical.velocity.y;  
            
            //console.log(physical.velocity.y)

            entity.position = entity.position.add(new Vector3(x, y, z).multiplyScalar(dt));
        }
    }
}

function getDirection(x: number, z: number) {
    if (Math.abs(x) > Math.abs(z)) {
        return x > 0 ? EntityDirection.E : EntityDirection.W;
    } else {
        return z > 0 ? EntityDirection.S : EntityDirection.N;
    }
}