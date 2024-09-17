import { Movable } from '../Components/Movable';
import { Entity } from '../Entities/Entity';
import { Game } from '../Game/Game';
import { System } from './System';

export class RandomMovementSystem extends System {
	public constructor() {
		super();
	}

	public appliesTo(entity: Entity): boolean {
        return false
    }

	public update(dt: number, game: Game): void {
		for (const entity of this.filteredEntities) {
			// const movable = entity.getComponent(Movable);
            // const speed = entity.hasComponent(Stats) ? entity.getComponent(Stats).speed.current : 1;
			// const currentPosition = entity.position;
			// const { originalPosition, radius, moveLength } = movable.randomMovementSettings;
			// const [originX, originY] = originalPosition;

            // if (movable.waitTime > 0) {
            //     movable.waitTime -= dt;

            //     if (movable.waitTime <= 0) {
            //         movable.waitTime = 0;
            //     }
            // }

			// if (!movable.movingTo && !movable.waitTime) {
            //     // Get a new random point within bounds based on the entity's current position
			// 	const [newX, newY] = getRandomPointWithinBounds(currentPosition, originX, originY, radius, moveLength);
                
			// 	movable.movingTo = [newX, newY];
			// }

            // if (movable.movingTo && !movable.waitTime) {
            //     // Calculate the vector direction towards the new point
            //     const vectorX = movable.movingTo[0] - currentPosition[0];
            //     const vectorY = movable.movingTo[1] - currentPosition[1];
    
            //     // Check if the entity has reached the target (allow some small tolerance)
            //     const distanceToTarget = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
            //     const tolerance = 0.1; // Allowable distance to consider the entity "arrived"
    
            //     if (distanceToTarget < tolerance) {
            //         // Entity has arrived at the target
            //         // movable.waiting = true; // Start waiting
            //         movable.movingTo = null; // Clear the destination
            //         movable.waitTime = movable.randomMovementSettings.waitDuration;
            //         continue;
            //     }
                
            //     // Normalize the vector to make it unit length, then multiply by speed
            //     const magnitude = distanceToTarget;
                
            //     movable.vector[0] = (vectorX / magnitude) * speed;
            //     movable.vector[1] = (vectorY / magnitude) * speed;

            //     // entity.direction = [];

            // } else {
            //     movable.vector[0] = 0;
            //     movable.vector[1] = 0;
            // }
		}
	}
}

function getRandomPointWithinBounds(currentPosition: [number, number], originX: number, originY: number, radius: number, walkLength: number): [number, number] {
	// Calculate distance from the current position to the origin
	const distanceFromOrigin = Math.sqrt(Math.pow(currentPosition[0] - originX, 2) + Math.pow(currentPosition[1] - originY, 2));

	// Calculate the maximum allowed distance to move within the bounds of the radius
	const maxPossibleWalk = Math.min(walkLength, radius - distanceFromOrigin);

	// Generate a random angle (from 0 to 2π) for the movement direction
	const randomAngle = Math.random() * Math.PI * 2;

	// Calculate the new X and Y positions based on the random angle and maxPossibleWalk
	const newX = currentPosition[0] + Math.cos(randomAngle) * maxPossibleWalk;
	const newY = currentPosition[1] + Math.sin(randomAngle) * maxPossibleWalk;

	return [newX, newY];
}
