import { Component } from '../Components/Component';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';

export type Constructor<T> = new (...args: any[]) => T

export enum EntityState {
    IDLING,
    WALKING,
    ATTACKING,
    DYING,
}

export enum EntityDirection {
    N,
    E,
    S,
    W
}

export type SpriteSheetMap = {
    state: EntityState,
    direction: EntityDirection,
    xIndex: number,
    yIndex: number,
    steps: number,
    speed: number,
}[]

export class Entity {
    private readonly components: Component[] = [];
    private step: number = 0;
    private timeElapsed: number = 0;  // Time passed since last frame update

    public position: Vector3 = new Vector3(0, 0, 0); // [x, y, z]
    
    public zIndex: number = 0;
    public direction: EntityDirection = EntityDirection.S;
    public state: EntityState = EntityState.IDLING;

    public frameHeight: number = 16;
    public frameWidth: number = 16;
    public width: number = 16;
    public height: number = 16;
    public image: HTMLImageElement = new Image();
    public spirteSheetMap: SpriteSheetMap = [];

    public castShadow: boolean = true;

	getComponent<T>(type: Constructor<T>): T {
		for (const component of this.components) {
			if (component instanceof type) {
				return component
			}
		}

		throw new Error(
			`Failed to get component type ${type}. Please run hasComponent first!`
		)
	}

    public addComponent(component: Component): void {
        this.components.push(component);
    }

    public addComponents(...components: Component[]): void {
        for (const component of components) {
            this.addComponent(component);
        }
    }

    public hasComponent<T extends Component>(type: T): boolean {
        for (const component of this.components) {
            // @ts-ignore
            if (component instanceof type) {
                return true;
            }
        }

        return false;
    }

    public hasComponents<T extends Component>(types: T[]): boolean {
        for (const type of types) {
            if (!this.hasComponent(type)) {
                return false;
            }
        }

        return true;
    }

    public setState(state: EntityState) {
        this.state = state;

        if (this.state !== state) {
            this.step = 0;
            this.timeElapsed = 0;
        }
    }

    public draw(ctx: CanvasRenderingContext2D, dt: number) {
        // Calculate position on the canvas
        // const positionX = Game.getWorldPosition(position.x, position.y) - (this.width / 2);
        // const positionY = (this.position[1] * Game.TILE_SIZE_HEIGHT / 2) - (this.position[0] * Game.TILE_SIZE_HEIGHT / 2) - this.height;
        
        // if (this.castShadow) {
        //     const shadowX = positionX - (this.width / 2);
        //     const shadowY = positionY + this.height;

        //     ctx.ellipse(shadowX, shadowY, this.width, this.height / 2, Math.PI, 0, 4 * Math.PI);
        //     ctx.fill();
        // }

        ctx.imageSmoothingEnabled = false;

        let animationData = this.spirteSheetMap.find((map) => 
            map.state === this.state &&
            map.direction === this.direction
        );
        
        if (!animationData) {
            ctx.drawImage(
                this.image,
                this.position.y,
                this.position.z,
                this.width,
                this.height
            );

            return;
        }
        
        const { xIndex, yIndex, steps, speed } = animationData;
        
        // Calculate source X and Y position in the sprite sheet
        const sourceX = (xIndex + this.step) * this.frameWidth;
        const sourceY = yIndex * this.frameHeight;
        
        // const scale = 1 + this.position[2] / 300;
        // const offsetY = -this.position[2]; // Move up by max 50 units
    
        // Save the current transformation matrix
        ctx.save();
    
        // // Apply transformations
        // ctx.translate(positionX + this.width / 2, positionY + this.height / 2);
        // ctx.scale(scale, scale);
        // ctx.translate(-this.width / 2, -this.height / 2 + offsetY);
    
        // Draw the specific frame from the sprite sheet
        ctx.drawImage(
            this.image,
            sourceX,
            sourceY,
            this.frameWidth,
            this.frameHeight,
            this.position.x - this.width / 2,
            this.position.z + this.height / 2,
            this.width,
            this.height
        );
        
        // // Restore the transformation matrix
        // ctx.restore();
        
        // Accumulate the time elapsed
        this.timeElapsed += dt;
    
        // Calculate the duration of each frame in the animation
        const frameDuration = speed / steps;  // Total time for the whole animation divided by the number of steps
    
        if (this.timeElapsed >= frameDuration) {
            this.step++;
            this.timeElapsed = 0;  // Reset time for the next frame
        }
    
        if (this.step >= steps) {
            this.step = xIndex;  // Reset step for looping animations
        }
    }
    
}
