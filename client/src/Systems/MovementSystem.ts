import { Movable } from '../Components/Movable';
import { Physical } from '../Components/Physical';
import { Stats } from '../Components/Stats';
import { Entity, EntityDirection, EntityState } from '../Entities/Entity';    
import { Player } from '../Entities/Player';
import { Game } from '../Game/Game';
import { System } from './System';

export class MovementSystem extends System {
    private inputs = new Set();

    public constructor() {
        super();


        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    public onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'w': this.inputs.add('w'); break;
            case 'a': this.inputs.add('a'); break;
            case 's': this.inputs.add('s'); break;
            case 'd': this.inputs.add('d'); break;
            case 'Shift': this.inputs.add('Shift'); break;
            case 'v': this.inputs.add('v'); break;
        }
    }

    public onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case 'w': this.inputs.delete('w'); break;
            case 'a': this.inputs.delete('a'); break;
            case 's': this.inputs.delete('s'); break;
            case 'd': this.inputs.delete('d'); break;
            case 'Shift': this.inputs.delete('Shift'); break;
            case 'v': this.inputs.delete('v'); break;
        }
    }
    
    public appliesTo(entity: Entity): boolean {
        return (
            entity instanceof Player 
            && entity.hasComponent(Movable)
            && entity.hasComponent(Physical)
        )
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities) {
            const movable = entity.getComponent(Movable);
            const physical = entity.getComponent(Physical);
            const stats = entity.hasComponent(Stats) ? entity.getComponent(Stats) : null;

            const speed = stats ? stats.speed.current : 1;

            let y = 0;
            let x = 0;
            let z = 0;
            let multiplierY = 1;
            let multiplierX = 1;

            // MOVE UP
            if (this.inputs.has('w')) {
                y -= 1;
            }

            // MOVE DOWN
            if (this.inputs.has('s')) {
                y += 1;
            }

            // MOVE RIGHT
            if (this.inputs.has('a')) {
                x -= 1;
            }

            // MOVE LEFT
            if (this.inputs.has('d')) {
                x += 1;
            }

            // JUMP
            if (this.inputs.has('v')) {
                z += 100;
            }

            // SPRINT
            if (this.inputs.has('Shift')) {
                if (stats && stats?.stamina.current > 0) {
                    multiplierX = 5;
                    multiplierY = 5;
                    stats.stamina.current -= 1;
                }
            }

            // You can only jump & move while being on ground
            if (entity.position[2] === 0) {
                movable.vector[0] = x * speed * multiplierX;
                movable.vector[1] = y * speed * multiplierY;
                physical.velocity[2] += z;
            }
        }
    }
}