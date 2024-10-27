import { Movable } from '../Components/Movable';
import { Entity, EntityState } from '../Entities/Entity';
import { Game } from '../Game/Game';
import { System } from './System';

export class StateSystem extends System {
	public constructor() {
		super();
	}

	public appliesTo(entity: Entity): boolean {
		return true;
	}

	public update(dt: number, game: Game): void {
		for (const entity of this.filteredEntities) {
			if (entity.hasComponent(Movable)) {
                const movable = entity.getComponent(Movable);

                if (movable.vector.length() > 0) {
                    entity.setState(EntityState.WALKING);

                    return;
                }
            }

            entity.setState(EntityState.IDLING);
		}
	}
}