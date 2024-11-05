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
                        const intersectionArea = hitbox.getIntersectArea(hitbox2);

                        let x = 0;
                        let y = 0;
                        let z = 0;

                        const deltaX = intersectionArea.max.x - intersectionArea.min.x;
                        const deltaY = intersectionArea.max.y - intersectionArea.min.y;
                        const deltaZ = intersectionArea.max.z - intersectionArea.min.z;

                        const min = Math.min(deltaY, deltaX, deltaZ);

                        const velocity = entity.getComponent(Physical).velocity;
            
                        // OVER AND UNDER
                        if (deltaY === min) { 
                            if (entity.position.y > entity2.position.y) {
                                velocity.y = Math.max(0, velocity.y);
                                y = deltaY;
                            } else {
                                y = -1 * deltaY;
                                velocity.y = Math.min(0, velocity.y);
                            }
                        }

                        // NORTH AND SOUTH
                        if (deltaZ === min) {
                            if (entity.position.z > entity2.position.z) {
                                z = deltaZ;
                            } else {
                                z = -1 * deltaZ;
                            }
                        }
                
                        // WEST AND EAST
                        if  (deltaX === min) { 
                            if (entity.position.x > entity2.position.x) {
                                x = deltaX;
                            } else {
                                x = -1 * deltaX;
                            }
                        }

                        entity.position.z += deltaX;
                        entity.position.y += deltaY;
                        entity.position.x += deltaZ;
                    }
                }
            }
        }
    }
}