import { Entity } from '../Entities/Entity';
import { Player } from '../Entities/Player';
import { Slime } from '../Entities/Enemies/Slimes/Slime';
import { EntityAdded } from '../Event/EntityAdded';
import { EntityRemoved } from '../Event/EntityRemoved';
import { EventBus } from '../Event/EventBus';
import { CameraSystem } from '../Systems/CameraSystem';
import { MovementSystem } from '../Systems/MovementSystem';
import { RandomMovementSystem } from '../Systems/RandomMovementSystem';
import { RenderSystem } from '../Systems/RenderSystem';
import { StateSystem } from '../Systems/StateSystem';
import { System } from '../Systems/System';
import { VelocitySystem } from '../Systems/VelocitySystem';
import { HudSystem } from '../Systems/HudSystem';
import { DebugSystem } from '../Systems/DebugSystem';
import { GravitySystem } from '../Systems/GravitySystem';
import { Tile } from '../Entities/Tile';

export class Game {
    private static readonly TIME_STEP = 1 / 144;
    private static readonly MAX_UPDATES_PER_FRAME = 10;
    private static readonly FPS_DECAY = 0.1;
    private static readonly FPS_CAP = -1; // -1 === uncapped

    public static readonly TILE_SIZE = 64;

    private readonly map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    public readonly events = new EventBus();
    public fps = 1 / Game.TIME_STEP;
    
    private readonly entities: Entity[] = [
        new Player(),
        new Slime([0, 0, 0]),
        ...this.map.map((row, y) => 
            row.map(
                (tile, x) => new Tile(
                    [x, y, 1],
                    -1
                )
            )
        ).flat()
    ];
    
    private readonly systems: System[] = [
        // Normal Systems
        new MovementSystem(),
        new RandomMovementSystem(),
        new VelocitySystem(),
        
        // Try to not adjust these
        new GravitySystem(),
        new StateSystem(),
        new CameraSystem(),
        new RenderSystem(),
        new HudSystem(),
        new DebugSystem()
    ];
    
    private animationFrameId: number | null = null;
    private running = false;
    private lastTimestamp = 0;
    
    public height: number = window.innerHeight;
    public width: number = window.innerWidth;
    
    public cameraPos = [0, 0];

    public constructor(
        public readonly ctx: CanvasRenderingContext2D,
        public readonly io: any
    ) {
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;

        addEventListener('resize', this.onResize.bind(this));
    }

    public addSystem(system: System): void {
        this.systems.push(system);
        system.initialize(this);
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.events.emit(new EntityAdded(entity));
    }

    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);

        if (index >= 0) {
            this.entities.splice(index, 1);
            this.events.emit(new EntityRemoved(entity));
        }
    }

    public start(): void {
        if (!this.running) {
            this.running = true;
            
            this.animationFrameId = requestAnimationFrame(this.update.bind(this));

            for (const system of this.systems) {
                const filteredEntities = this.entities.filter(system.appliesTo);
                for (const entity of filteredEntities) {
                    system.addEntity(entity);
                }
            }

            this.events.register(EntityRemoved, (event: EntityRemoved) => {
                for (const system of this.systems) {
                    if (system.appliesTo(event.entity)) {
                        system.removeEntity(event.entity)
                    }
                }
            });

            this.events.register(EntityAdded, (event: EntityAdded) => {
                for (const system of this.systems) {
                    if (system.appliesTo(event.entity)) {
                        system.addEntity(event.entity)
                    }
                }
            });
        }
    }

    public stop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.fps = 1 / Game.TIME_STEP;
        this.lastTimestamp = 0;
        this.running = false;
    }

    public update(currentTimestamp: number): void {
        if (Game.FPS_CAP > 0 && currentTimestamp < this.lastTimestamp + 1 / Game.FPS_CAP * 1000) {
            this.animationFrameId = requestAnimationFrame(this.update.bind(this));
            return;
        }

        let updates = 0;
        let dt: number;

        if (this.lastTimestamp === 0) {
            // First frame, there's no delta time
            dt = Game.TIME_STEP;
            this.lastTimestamp = currentTimestamp;
        } else {
            dt = (currentTimestamp - this.lastTimestamp) / 1000;
        }

        if (dt < Game.TIME_STEP) {
            this.animationFrameId = requestAnimationFrame(this.update.bind(this));
            return;
        }

        this.fps = Game.FPS_DECAY * (1 / dt) + (1 - Game.FPS_DECAY) * this.fps;

        while (this.running && dt >= Game.TIME_STEP) {

            for (const system of this.systems) {
                system.update(Game.TIME_STEP, this);
            }

            dt -= Game.TIME_STEP;
            updates++;

            if (updates >= Game.MAX_UPDATES_PER_FRAME) {
                console.error('Update loop can\'t keep up!');
                this.lastTimestamp = 0;
                break;
            }
        }

        this.lastTimestamp = currentTimestamp;

        if (this.running) {
            this.animationFrameId = requestAnimationFrame(this.update.bind(this));
        }
    }

    private onResize(): void {
        this.height = window.innerHeight;
        this.width = window.innerWidth;

        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
    }
}
