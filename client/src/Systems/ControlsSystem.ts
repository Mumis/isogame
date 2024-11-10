import { Abilities } from '../Components/Abilities';
import { Movable } from '../Components/Movable';
import { Physical } from '../Components/Physical';
import { Stats } from '../Components/Stats';
import { Entity } from '../Entities/Entity';    
import { Player } from '../Entities/Player';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
import { System } from './System';

export class ControlsSystem extends System {
    public constructor() {
        super();
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity instanceof Player;
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities) {
            const movable = entity.hasComponent(Movable) ? entity.getComponent(Movable) : null;
            const physical = entity.hasComponent(Physical) ? entity.getComponent(Physical) : null;
            const stats = entity.hasComponent(Stats) ? entity.getComponent(Stats) : null;
            const abilities = entity.hasComponent(Abilities) ? entity.getComponent(Abilities) : null;

            // ------MOVEMENT START------ //
            const speed = stats ? stats.speed.current : 1;

            let y = 0;
            let x = 0;
            let z = 0;
            let multiplier = 1;

            // MOVE UP
            if (game.inputs.has(game.controls.moveUp)) {
                z += 1;
                x -= 1;
            }

            // MOVE DOWN
            if (game.inputs.has(game.controls.moveDown)) {
                z -= 1;
                x += 1;
            }

            // MOVE RIGHT
            if (game.inputs.has(game.controls.moveLeft)) {
                x -= 1;
                z -= 1;
            }

            // MOVE LEFT
            if (game.inputs.has(game.controls.moveRight)) {
                x += 1;
                z += 1;
            }
    
            // JUMP
            if (game.inputs.has(game.controls.jump) && physical?.velocity.y === 0) {
                y += 1;
            }
    
            // SPRINT
            if (
                (
                    game.inputs.has(game.controls.moveUp) ||
                    game.inputs.has(game.controls.moveDown) ||
                    game.inputs.has(game.controls.moveLeft) ||
                    game.inputs.has(game.controls.moveRight)
                ) 
                && game.inputs.has(game.controls.sprint)
            ) {
                if (stats && stats?.stamina.current > 0) {
                    multiplier = 2.2;
                    stats.stamina.current -= 1;
                }
            }


            if (movable) {
                movable.velocity = new Vector3(
                    x / Game.TILE_SIZE_WIDTH * speed * multiplier, 
                    0, 
                    z / Game.TILE_SIZE_WIDTH * speed * multiplier
                );
            }

            if (physical) {
                physical.velocity = physical.velocity.add(new Vector3(0, y * 16, 0));
            }

            // ------MOVEMENT END------ //


            // ------SKILLS START------ //

            if (game.inputs.has(game.controls.skill1)) {
                abilities?.castAbility(0, game);
            }

            if (game.inputs.has(game.controls.skill2)) {
                abilities?.castAbility(1, game);
            }

            if (game.inputs.has(game.controls.skill3)) {
                abilities?.castAbility(2, game);
            }

            if (game.inputs.has(game.controls.skill4)) {
                abilities?.castAbility(3, game);
            }

            if (game.inputs.has(game.controls.skill5)) {
                abilities?.castAbility(4, game);
            }

            if (game.inputs.has(game.controls.skill6)) {
                abilities?.castAbility(5, game);
            }

            if (game.inputs.has(game.controls.skill7)) {
                abilities?.castAbility(6, game);
            }

            if (game.inputs.has(game.controls.skill8)) {
                abilities?.castAbility(7, game);
            }

            // ------SKILLS END------ //
        }
    }
}