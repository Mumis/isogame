import { Collidable, CubeHitbox, IntersectArea } from '../Components/Collidable';
import { Physical } from '../Components/Physical';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

// Friction coefficient (adjust as necessary)
const frictionCoefficient = 0.9;

export class TerrainCollisionSystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Collidable);
    }

    public update(dt: number, game: Game): void {
        const radius = 20;

        for (let i = 0; i < this.filteredEntities.length; i++) {
            for (let j = i + 1; j < this.filteredEntities.length; j++) {
                const en1 = this.filteredEntities[i];
                const en2 = this.filteredEntities[j];

                let physical;
                let st;

                if (en1.hasComponent(Physical) && !en2.hasComponent(Physical)) {
                    physical = en1;
                    st = en2;
                } else if (en2.hasComponent(Physical) && !en1.hasComponent(Physical)) {
                    physical = en2;
                    st = en1;
                } else {
                    continue;
                }

                const inRadius = en1.position.distanceTo(en2.position) < radius;

                //if (!inRadius) return;

                const box1 = physical.getComponent(Collidable).box;
                const box2 = en2.getComponent(Collidable).box;

                if (
                    box1 instanceof CubeHitbox && 
                    box2 instanceof CubeHitbox
                ) {
                    const intersectArea = box1.intersectAABB(box2);

                    if (intersectArea) {
                        this.resolveStaticAABBCollision(physical, st, intersectArea);
                    }
                }
            }
        }
    }

    private resolveStaticAABBCollision(a: CubeHitbox, b: CubeHitbox, intersectArea: IntersectArea) {
        const physical1 = a.attached.getComponent(Physical);

        const deltaX = intersectArea.maxX - intersectArea.minX;
        const deltaY = intersectArea.maxY - intersectArea.minY;
        const deltaZ = intersectArea.maxZ - intersectArea.minZ;

        const min = Math.min(deltaY, deltaX, deltaZ);

        
        // OVER AND UNDER
        if (deltaY === min) { 
            if (a.attached.position.y > b.attached.position.y) {
                physical1.velocity.y = Math.max(0, physical1.velocity.y);
                a.attached.position.y += deltaY;
            } else {
                a.attached.position.y += -deltaY;
                physical1.velocity.y = Math.min(0, physical1.velocity.y);
            }
        }

        // NORTH AND SOUTH
        else if (deltaZ === min) {
            if (a.attached.position.z > b.attached.position.z) {
                a.attached.position.z += deltaZ / 2;
            } else {
                a.attached.position.z -= deltaZ / 2;
            }
        }

        // WEST AND EAST
        else if  (deltaX === min) { 
            if (a.attached.position.x > b.attached.position.x) {
                a.attached.position.x += deltaX / 2;
            } else {
                a.attached.position.x -= deltaX / 2;
            }
        }
    }

    private resolvePhysicalAABBCollision(entity: Entity, a: CubeHitbox, b: CubeHitbox, intersectArea: IntersectArea) {
        const distanceTo = a.attached.position.distanceTo(b.attached.position);

        const physical = a.attached.getComponent(Physical);
        const deltaX = intersectArea.maxX - intersectArea.minX;
        const deltaY = intersectArea.maxY - intersectArea.minY;
        const deltaZ = intersectArea.maxZ - intersectArea.minZ;

        const min = Math.min(deltaY, deltaX, deltaZ);
        
        // OVER AND UNDER
        if (deltaY === min) { 
            if (a.attached.position.y > b.attached.position.y) {
                physical.velocity.y = Math.max(0, physical.velocity.y);
                a.attached.position.y += deltaY;
            } else {
                a.attached.position.y += -deltaY;
                physical.velocity.y = Math.min(0, physical.velocity.y);
            }
        }

        // NORTH AND SOUTH
        else if (deltaZ === min) {
            if (a.attached.position.z > b.attached.position.z) {
                a.attached.position.z += deltaZ / 2;
            } else {
                a.attached.position.z -= deltaZ / 2;
            }
        }

        // WEST AND EAST
        else if  (deltaX === min) { 
            if (a.attached.position.x > b.attached.position.x) {
                a.attached.position.x += deltaX / 2;
            } else {
                a.attached.position.x -= deltaX / 2;
            }
        }
    }
}