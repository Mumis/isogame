import { Entity } from '../Entities/Entity';
import { Player } from '../Entities/Player';
import { Slime } from '../Entities/Enemies/Slimes/Slime';
import { EntityAdded } from '../Event/EntityAdded';
import { EntityRemoved } from '../Event/EntityRemoved';
import { EventBus } from '../Event/EventBus';
import { CameraSystem } from '../Systems/CameraSystem';
import { MovementSystem } from '../Systems/MovementSystem';
import { RandomMovementSystem } from '../Systems/RandomMovementSystem';
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
import { FogOfWarSystem } from '../Systems/FogOfWarSystem';
import { Collidable, CubeHitbox } from '../Components/Collidable';
import { CollisionSystem } from '../Systems/CollisionSystem';

export class Game {
    private static readonly TIME_STEP = 1 / 144;
    private static readonly MAX_UPDATES_PER_FRAME = 10;
    private static readonly FPS_DECAY = 0.1;
    private static readonly FPS_CAP = -1; // -1 === uncapped

    public static readonly TILE_SIZE_WIDTH = 64;
    public static readonly TILE_SIZE_DEPTH = 32;
    public static readonly TILE_OFFSET = 16;

    private readonly map = [
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
    ]

    static readonly events = new EventBus();
    public fps = 1 / Game.TIME_STEP;

    private readonly entities: Entity[] = [
        new Player()
    ];
    
    private readonly systems: System[] = [
        // Normal Systems
        new MovementSystem(),
        new RandomMovementSystem(),
        new VelocitySystem(),
        
        // Try to not adjust these
        new GravitySystem(),
        //new CollisionSystem(),
        new FogOfWarSystem(),
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

    public constructor(
        public readonly ctx: CanvasRenderingContext2D,
        public readonly io: any
    ) {
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;

        // Load map
        this.map.forEach((row, x) => 
            row.forEach(
                (tile, z) => {
                    this.entities.push(new Tile(
                    Math.floor(Math.random() * 30),
                    new Vector3(x, 0, z),
                    -1));
                }
            )
        );

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

        tile.addComponent(new Collidable(new CubeHitbox(1, 1, 0.5, tile.position), true));

        this.entities.push(tile)

        // for (let i = 0; i < 10000; i++) {
        //     this.entities.push(new Slime(new Vector3(Math.random() * 50, 0, Math.random() * 50)))
        // }

        window.addEventListener('click', (event) => {
            const mouseX = event.clientX; // Get the X coordinate of the mouse click
            const mouseY = event.clientY; // Get the Y coordinate of the mouse click
        
            // Convert the screen position to world position
            const worldPosition = Game.screenPosToWorldPos(new Vector3(mouseX, mouseY, 0));
        
            console.log(`World Position: ${worldPosition.floor()}`);
        });

        addEventListener('resize', this.onResize.bind(this));
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
                        system.removeEntity(event.entity)
                    }
                }
            });

            Game.events.register(EntityAdded, (event: EntityAdded) => {
                for (const system of this.systems) {
                    if (system.appliesTo(event.entity)) {
                        system.addEntity(event.entity)
                    }
                }
            });

            Game.events.register(EntityChanged, (event: EntityChanged) => {
                for (const system of this.systems) {
                    if (system.hasEntity(event.entity) && !system.appliesTo(event.entity)) {
                        system.removeEntity(event.entity)
                    }

                    if (!system.hasEntity(event.entity) && system.appliesTo(event.entity)) {
                        system.addEntity(event.entity);
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


    // public static screenPosToWorldPos(position: Vector3): Vector3 {
    //     const x = (position.x / Game.TILE_SIZE_WIDTH + position.z / Game.TILE_SIZE_DEPTH);
    //     const z = (position.x / Game.TILE_SIZE_WIDTH - position.z / Game.TILE_SIZE_DEPTH);
    //     const y = position.y;
    
    //     return new Vector3(x, y, z);
    // }
    
    public static worldPosToScreenPos(position: Vector3, offsetX: number = 0, offsetY: number = 0): Vector3 {
        const x = (position.x * Game.TILE_SIZE_WIDTH / 2) + (position.z * Game.TILE_SIZE_WIDTH / 2) + offsetX;
        const y = (position.x * (Game.TILE_SIZE_DEPTH) / 2) - (position.z * (Game.TILE_SIZE_DEPTH) / 2) - (position.y * Game.TILE_SIZE_DEPTH) + offsetY;

        return new Vector3(x, y, 0);
    }

    public static screenPosToWorldPos(screenPos: Vector3): Vector3 {
        const TILE_WIDTH = Game.TILE_SIZE_WIDTH;   // Width of tile
        const TILE_DEPTH = Game.TILE_SIZE_DEPTH;   // Depth of tile

        const x = ((screenPos.x) / (TILE_WIDTH / 2)) - ((screenPos.y) / (TILE_DEPTH / 2));
        const z = ((screenPos.x) / (TILE_WIDTH / 2)) + ((screenPos.y) / (TILE_DEPTH / 2));

        const y = (screenPos.y + (TILE_DEPTH / 2)) / TILE_DEPTH; // Adjust y based on depth

        return new Vector3(x, y, z);
    }

    // public static worldPosToScreenPos(pt:Vector3): Vector3 {
    //     var tempPt:Vector3 = new Vector3(0, 0, 0);
    //     tempPt.x = (2 * pt.z + pt.x) / 2;
    //     tempPt.z = (2 * pt.z - pt.x) / 2;
    //     return(tempPt);
    //   }

    //   public static screenPosToWorldPos(pt:Vector3): Vector3 {
    //     var tempPt:Vector3 = new Vector3(0,0,0);
    //     tempPt.x = pt.x - pt.z;
    //     tempPt.z = (pt.x + pt.z) / 2;
    //     return(tempPt);
    // }

    // public static isoTo2D(pt: Vector3): Vector3 {
    //     var tempPt: Vector3 = new Vector3(0, 0, 0);
    //     tempPt.x = (2 * pt.z + pt.x) / 2;
    //     tempPt.z = (2 * pt.z - pt.x) / 2;
    //     return(tempPt);
    // }

    // public static twoDToIso(pt:Vector3): Vector3 {
    //     var tempPt: Vector3 = new Vector3(0, 0, 0);
    //     tempPt.x = pt.x - pt.z;
    //     tempPt.z = (pt.x + pt.z) / 2;
    //     return(tempPt);
    // }

    // public static getTileCoordinates(pt: Vector3): Vector3 {
    //     var tempPt: Vector3 = new Vector3(0, 0, 0);
    //     tempPt.x = Math.floor(pt.x / Game.TILE_SIZE_WIDTH);
    //     tempPt.y = Math.floor(pt.z / Game.TILE_SIZE_DEPTH);
    //     return(tempPt);
    // }

    // public static worldPosToScreenPos(pt: Vector3): Vector3 {
    //     var tempPt: Vector3 = new Vector3(0, 0, 0);
    //     tempPt.x = Math.floor(pt.x / Game.TILE_SIZE_WIDTH);
    //     tempPt.y = Math.floor(pt.z / Game.TILE_SIZE_DEPTH);
    //     return(tempPt);
    //   }
    

    // public positionInCamera(position: Vector3): Vector3 {
        
    //     return position.subtract(new Vector3(
    //         this.cameraPosition.x - this.ctx.canvas.width / 2,
    //         this.cameraPosition.y,
    //         this.cameraPosition.z - this.ctx.canvas.width / 2
    //     ));
    // }
}
