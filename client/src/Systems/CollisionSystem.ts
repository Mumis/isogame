import { Collidable, CubeHitbox } from '../Components/Collidable';
import { Physical } from '../Components/Physical';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

// Friction coefficient (adjust as necessary)
const frictionCoefficient = 0.9;

export class CollisionSystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Collidable);
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities.filter(x => !x.getComponent(Collidable).stationary && x.hasComponent(Physical))) {
            const collidable = entity.getComponent(Collidable);
            const physical = entity.getComponent(Physical);
            const hitbox = collidable.box;

            for (const entity2 of this.filteredEntities.filter(x => x !== entity)) {
                const collidable2 = entity2.getComponent(Collidable);
                //const physical2 = entity2.getComponent(Physical);
                const hitbox2 = collidable2.box;

                if (hitbox instanceof CubeHitbox && hitbox2 instanceof CubeHitbox) {
                    const intersectionArea = hitbox.intersectAABB(hitbox2);

                    if (intersectionArea) {
                        const deltaX = intersectionArea.maxX - intersectionArea.minX;
                        const deltaY = intersectionArea.maxY - intersectionArea.minY;
                        const deltaZ = intersectionArea.maxZ - intersectionArea.minZ;

                        const min = Math.min(deltaY, deltaX, deltaZ);
                        
                        // OVER AND UNDER
                        if (deltaY === min) { 
                            if (hitbox.attached.position.y > hitbox2.attached.position.y) {
                                physical.velocity.y = Math.max(0, physical.velocity.y);
                                entity.position.y += deltaY;
                            } else {
                                entity.position.y += -deltaY;
                                physical.velocity.y = Math.min(0, physical.velocity.y);
                            }
                        }

                        // NORTH AND SOUTH
                        else if (deltaZ === min) {
                            if (hitbox.attached.position.z > hitbox2.attached.position.z) {
                                entity.position.z += deltaZ;
                            } else {
                                entity.position.z -= deltaZ;
                            }
                        }
                
                        // WEST AND EAST
                        else if  (deltaX === min) { 
                            if (hitbox.attached.position.x > hitbox2.attached.position.x) {
                                hitbox.attached.position.x += deltaX;
                            } else {
                                hitbox.attached.position.x -= deltaX;
                            }
                        }
                    }
                }
            }
        }
    }
}