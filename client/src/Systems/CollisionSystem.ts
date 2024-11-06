import { Collidable, CubeHitbox } from '../Components/Collidable';
import { Physical } from '../Components/Physical';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

export class CollisionSystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Collidable);
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities.filter(x => !x.getComponent(Collidable).stationary)) {
            const collidable = entity.getComponent(Collidable);
            const hitbox = collidable.box;

            for (const entity2 of this.filteredEntities.filter(x => x !== entity)) {
                const collidable2 = entity2.getComponent(Collidable);
                const hitbox2 = collidable2.box;

                if (hitbox instanceof CubeHitbox && hitbox2 instanceof CubeHitbox) {
                    if (hitbox.intersectAABB(hitbox2) && entity.hasComponent(Physical)) {
                        const overlap = hitbox.overlapAABB(hitbox2);

                        // Determine the smallest overlap to push the entity out
                        if (overlap.x < overlap.y && overlap.x < overlap.z) {
                            console.log('overlapx')
                            // Push along X axis
                            entity.position.x += (entity.position.x < entity2.position.x ? -overlap.x : overlap.x);
                        } else if (overlap.y < overlap.x && overlap.y < overlap.z) {
                            console.log('overlapy')
                            // Push along Y axis
                            entity.position.y += (entity.position.y < entity2.position.y ? -overlap.y : overlap.y);
                            entity.getComponent(Physical).velocity.y = 0;
                            //console.log('wtf')
                        } else {
                            console.log('overlapz')
                            // Push along Z axis
                            entity.position.z += (entity.position.z < entity2.position.z ? -overlap.z : overlap.z);
                        }

                        //console.log(overlap)
                    }
                }
            }
        }
    }
}