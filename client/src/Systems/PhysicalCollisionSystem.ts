import { Collidable, CubeHitbox, IntersectArea } from '../Components/Collidable';
import { Physical } from '../Components/Physical';
import { Entity } from '../Entities/Entity';    
import { Game } from '../Game/Game';
import { System } from './System';

// Friction coefficient (adjust as necessary)
const frictionCoefficient = 0.9;

export class PhysicalCollisionSystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Collidable) && entity.hasComponent(Physical);
    }

    public update(dt: number, game: Game): void {
        const radius = 20;

        for (let i = 0; i < this.filteredEntities.length; i++) {
            for (let j = i + 1; j < this.filteredEntities.length; j++) {
                const en1 = this.filteredEntities[i];
                const en2 = this.filteredEntities[j];

                const inRadius = en1.position.distanceTo(en2.position) < radius;

                //if (!inRadius) return;

                const box1 = en1.getComponent(Collidable).box;
                const box2 = en2.getComponent(Collidable).box;

                if (box1 instanceof CubeHitbox && box2 instanceof CubeHitbox) {
                    const intersectArea = box1.intersectAABB(box2);

                    if (intersectArea) {
                        this.resolveAABBCollision(box1, box2, intersectArea);
                    }
                }
            }
        }
    }

    private resolveAABBCollision(a: CubeHitbox, b: CubeHitbox, intersectArea: IntersectArea) {
        const physical1 = a.attached.getComponent(Physical);
        const physical2 = b.attached.getComponent(Physical);
        // Calculate direction vector from entity1 to entity2
        const direction = b.attached.position.clone().subtract(a.attached.position).normalize();
        
        // Determine smallest overlap for minimal displacement
        const deltaX = intersectArea.maxX - intersectArea.minX;
        const deltaY = intersectArea.maxY - intersectArea.minY;
        const deltaZ = intersectArea.maxZ - intersectArea.minZ;
        const minOverlap = Math.min(deltaX, deltaY, deltaZ);
        
        // Determine the push distance based on overlap
        const pushDistance = minOverlap / 2;
        // console.log(pushDistance)
    
        // Apply equal push to both entities in opposite directions
        a.attached.position = a.attached.position.add(direction.multiplyScalar(-pushDistance));
        b.attached.position = b.attached.position.add(direction.multiplyScalar(pushDistance));
    }    
}