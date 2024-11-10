import { Entity } from '../Entities/Entity';
import { Player } from '../Entities/Player';
import { Slime } from '../Entities/Enemies/Slimes/Slime';
import { EntityAdded } from '../Event/EntityAdded';
import { EntityRemoved } from '../Event/EntityRemoved';
import { EventBus } from '../Event/EventBus';
import { CameraSystem } from '../Systems/CameraSystem';
import { DrawSystem } from '../Systems/DrawSystem';
import { StateSystem } from '../Systems/StateSystem';
import { System } from '../Systems/System';
import { VelocitySystem } from '../Systems/VelocitySystem';
import { HudSystem } from '../Systems/HudSystem';
import { DebugSystem } from '../Systems/DebugSystem';
import { GravitySystem } from '../Systems/GravitySystem';
import { Tile } from '../Entities/Tile';
import { Vector3 } from '../Util/Vector3';
import { EntityChanged } from '../Event/EntityChanged';
import { ChunkSystem } from '../Systems/CunkSystem';
import { Collidable, CubeHitbox } from '../Components/Collidable';
import { PhysicalCollisionSystem } from '../Systems/PhysicalCollisionSystem';
import { TerrainCollisionSystem } from '../Systems/TerrainCollisionSystem';
import { World } from './World';
import Controls from './controls.json';
import { ControlsSystem } from '../Systems/ControlsSystem';

export class Game {
    private static readonly TIME_STEP = 1 / 144;
    private static readonly FPS_DECAY = 0.1;

    public static readonly TILE_SIZE_WIDTH = 64;
    public static readonly TILE_SIZE_DEPTH = 32;
    public static readonly TILE_OFFSET = 16;

    public controls = Controls;

    private readonly map = [[
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 2, 1, 19, 20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 9, 8, 7, 3, 18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 10, 6, 4, 1, 17, 1, 1, 1, 1, 20, 1, 1, 1, 1, 1, 1, 1],
        [1, 11, 5, 1, 16, 30, 29, 28, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 12, 1, 1, 15, 1, 1, 27, 1, 1, 30, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 14, 1, 1, 26, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 25, 1, 1, 1, 17, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 22, 1, 1, 16, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 16, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]];
    
    static readonly events = new EventBus();
    public fps = 1 / Game.TIME_STEP;

    private readonly entities: Entity[] = [
        new Player(),
        new Slime()
    ];
    
    private readonly systems: System[] = [
        // Normal Systems
        //new RandomMovementSystem(),
        
        new ControlsSystem(),
        // new GravitySystem(),
        new VelocitySystem(),

        new PhysicalCollisionSystem(),
        // new TerrainCollisionSystem(),
        
        // Try to not adjust these
        new ChunkSystem(),
        new StateSystem(),
        new CameraSystem(),
        new DrawSystem(),
        new HudSystem(),
        //new DebugSystem(),
    ];
    
    private animationFrameId: number | null = null;
    private running = false;
    private lastTimestamp = 0;
    
    public height: number = window.innerHeight;
    public width: number = window.innerWidth;
    
    public cameraPosition: Vector3 = new Vector3();

    public inputs = new Set();
    public mouseWorldPos = new Vector3();

    public constructor(
        public readonly ctx: CanvasRenderingContext2D,
        public readonly io: any
    ) {
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;

        // Load map
        for (let y = 0; y < this.map.length; y++){
            const layer = this.map[y];

            for (let x = 0; x < layer.length; x++){
                const row = layer[x];

                for (let z = 0; z < row.length; z++){
                    const tile1 = row[z];

                    this.entities.push(new Tile(
                      tile1,
                      new Vector3(x, y, z), // Now we pass x, y, z directly
                      0
                    ));
                }
            }
        }

        // for (let x = -100; x < 100; x++) {
        //     for (let z = -100; z < 100; z++) {
        //         this.entities.push(new Tile(
        //             1,
        //             new Vector3(x, -0.5, z),
        //             0
        //         ));
        //     }
        // }

        // for (let i = 1; i < 10; i++) {
        //     this.entities.push(new Tile(
        //         1,
        //         new Vector3(0, i, 0),
        //         0
        //     ))
        // }

        const tile = new Tile(
            10,
            new Vector3(5, 0.5, 5),
            0
        );

        tile.addComponent(new Collidable(new CubeHitbox(tile, 1, 1, 0.5)));

        this.entities.push(tile)

        for (let i = 0; i < 400; i++) {
            this.entities.push(new Slime(new Vector3(Math.random() * 40, 3, Math.random() * 40), 32 + Math.random() * 64));
        }

        addEventListener('keydown', this.onKeyDown.bind(this));
        addEventListener('keyup', this.onKeyUp.bind(this));
        addEventListener('mousedown', this.onMouseDown.bind(this));
        addEventListener('mouseup', this.onMouseUp.bind(this));
        addEventListener('mousemove', this.onMouseMove.bind(this));
        addEventListener('resize', this.onResize.bind(this));
        
        addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    }

    public onMouseMove(event: MouseEvent) {
        console.log(event);
    }

    public onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            this.inputs.add('mouseLeft');
        }

        if (event.button === 2) {
            this.inputs.add('mouseRight');
        }
    }

    public onMouseUp(event: MouseEvent) {
        if (event.button === 0) {
            this.inputs.delete('mouseLeft');
        }

        if (event.button === 2) {
            this.inputs.delete('mouseRight');
        }
    }

    public onKeyDown(event: KeyboardEvent) {
        console
        this.inputs.add(event.code);
    }

    public onKeyUp(event: KeyboardEvent) {
        this.inputs.delete(event.code);
    }

    public addSystem(system: System): void {
        this.systems.push(system);
        system.initialize(this);
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
        Game.events.emit(new EntityAdded(entity));
    }

    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);

        if (index >= 0) {
            this.entities.splice(index, 1);
            Game.events.emit(new EntityRemoved(entity));
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

            Game.events.register(EntityRemoved, (event: EntityRemoved) => {
                for (const system of this.systems) {
                    if (system.appliesTo(event.entity)) {
                        system.removeEntity(event.entity);
                        system.filteredEntitiesUpdated(this);
                    }
                }
            });

            Game.events.register(EntityAdded, (event: EntityAdded) => {
                for (const system of this.systems) {
                    if (system.appliesTo(event.entity)) {
                        system.addEntity(event.entity)
                        system.filteredEntitiesUpdated(this);
                    }
                }
            });

            Game.events.register(EntityChanged, (event: EntityChanged) => {
                for (const system of this.systems) {
                    if (system.hasEntity(event.entity) && !system.appliesTo(event.entity)) {
                        system.removeEntity(event.entity);
                        system.filteredEntitiesUpdated(this);
                    }

                    if (!system.hasEntity(event.entity) && system.appliesTo(event.entity)) {
                        system.addEntity(event.entity);
                        system.filteredEntitiesUpdated(this);
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
        let dt: number;

        if (this.lastTimestamp === 0) {
            // First frame, there's no delta time
            dt = Game.TIME_STEP;
        } else {
            dt = (currentTimestamp - this.lastTimestamp) / 1000;
        }

        this.lastTimestamp = currentTimestamp;
        this.fps = Game.FPS_DECAY * (1 / dt) + (1 - Game.FPS_DECAY) * this.fps;

        for (const system of this.systems) {
            system.update(Game.TIME_STEP, this);
        }

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


    // public static screenPosToWorldPos(position: Vector3): Vector3 {
    //     const x = (position.x / Game.TILE_SIZE_WIDTH + position.z / Game.TILE_SIZE_DEPTH);
    //     const z = (position.x / Game.TILE_SIZE_WIDTH - position.z / Game.TILE_SIZE_DEPTH);
    //     const y = position.y;
    
    //     return new Vector3(x, y, z);
    // }

    public isoToThreeD(position: Vector3): Vector3{
        const x = (position.x / (Game.TILE_SIZE_WIDTH / 2) + position.y / (Game.TILE_SIZE_DEPTH / 2)) / 2;
        const z = (position.x / (Game.TILE_SIZE_WIDTH / 2) - position.y / (Game.TILE_SIZE_DEPTH / 2)) / 2;
        const y = -(position.y + (x * Game.TILE_SIZE_DEPTH / 2) - (z * Game.TILE_SIZE_DEPTH / 2)) / Game.TILE_SIZE_DEPTH;
    
        return new Vector3(x, y, z);
    }

    public threeDtoIso(position: Vector3): Vector3{
        const x = ((position.x * Game.TILE_SIZE_WIDTH / 2) + (position.z * Game.TILE_SIZE_WIDTH / 2));
        const z = 0;
        const y = ((position.x * Game.TILE_SIZE_DEPTH / 2) - (position.z * Game.TILE_SIZE_DEPTH / 2))  - (position.y * Game.TILE_SIZE_DEPTH);

        return new Vector3(x, y, z);
    }

    public worldPosToScreenPos(position: Vector3): Vector3 {
        const cameraIsoPos = this.threeDtoIso(this.cameraPosition);

        // Calculate the camera offsets to center the view
        const cameraX = cameraIsoPos.x - this.ctx.canvas.width / 2;
        const cameraY = cameraIsoPos.y - this.ctx.canvas.height / 2;

        const isoPos = this.threeDtoIso(position);

        return isoPos.subtract(new Vector3(cameraX, cameraY, 0));
    }

    public screenPosToWorldPos(position: Vector3): Vector3 {
        const cameraIsoPos = this.threeDtoIso(this.cameraPosition);

        // Calculate the camera offsets to center the view
        const cameraX = cameraIsoPos.x - this.ctx.canvas.width / 2;
        const cameraY = cameraIsoPos.y - this.ctx.canvas.height / 2;

        const isoPos = this.threeDtoIso(position);

        return isoPos.add(new Vector3(cameraX, cameraY, 0));
    }
}
