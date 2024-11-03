import { Movable } from '../Components/Movable';
import { Stats } from '../Components/Stats';
import { Entity } from '../Entities/Entity';    
import { Player } from '../Entities/Player';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';
import { System } from './System';

export class MovementSystem extends System {
    private inputs = new Set();

    public constructor() {
        super();

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    public onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'KeyW': this.inputs.add('up'); break;
            case 'KeyS': this.inputs.add('down'); break;
            case 'KeyA': this.inputs.add('left'); break;
            case 'KeyD': this.inputs.add('right'); break;
            case 'ShiftLeft': this.inputs.add('sprint'); break;
            case 'Space': this.inputs.add('jump'); break;
        }
    }

    public onKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            case 'KeyW': this.inputs.delete('up'); break;
            case 'KeyS': this.inputs.delete('down'); break;
            case 'KeyA': this.inputs.delete('left'); break;
            case 'KeyD': this.inputs.delete('right'); break;
            case 'ShiftLeft': this.inputs.delete('sprint'); break;
            case 'Space': this.inputs.delete('jump'); break;
        }
    }
    
    public appliesTo(entity: Entity): boolean {
        return entity instanceof Player && entity.hasComponent(Movable);
    }

    public update(dt: number, game: Game): void {
        for (const entity of this.filteredEntities) {
            const movable = entity.getComponent(Movable);
            const stats = entity.hasComponent(Stats) ? entity.getComponent(Stats) : null;

            const speed = stats ? stats.speed.current : 1;

            let y = 0;
            let x = 0;
            let z = 0;
            let multiplier = 1;

            // MOVE UP
            if (this.inputs.has('up')) {
                z += 1;
                x -= 1;
            }

            // MOVE DOWN
            if (this.inputs.has('down')) {
                z -= 1;
                x += 1;
            }

            // MOVE RIGHT
            if (this.inputs.has('left')) {
                x -= 1;
                z -= 1;
            }

            // MOVE LEFT
            if (this.inputs.has('right')) {
                x += 1;
                z += 1;
            }
    
            // You can only jump & move while being on ground
            if (entity.position.y === 0) {
                // JUMP
                if (this.inputs.has('jump')) {
                    y += 200;
                }
    
                // SPRINT
                if (
                    (
                        this.inputs.has('up') ||
                        this.inputs.has('down') ||
                        this.inputs.has('left') ||
                        this.inputs.has('right')
                    ) 
                    && this.inputs.has('sprint')
                ) {
                    if (stats && stats?.stamina.current > 0) {
                        multiplier = 2.2;
                        stats.stamina.current -= 1;
                    }
                }

                const xzVector = new Vector3(x, 0, z).normalize().divideScalar(32).multiplyScalar(speed).multiplyScalar(multiplier);
                const yVector = new Vector3(0, y, 0).divideScalar(32);
                movable.vector = new Vector3(xzVector.x, yVector.y, xzVector.z);
            }
        }
    }
}