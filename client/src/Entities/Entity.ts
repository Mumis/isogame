import { Component } from '../Components/Component';
import { EntityChanged } from '../Event/EntityChanged';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';

export type Constructor<T> = new (...args: any[]) => T

export enum EntityState {
    IDLING,
    WALKING,
    ATTACKING,
    DYING,
    AIRBORNE
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
    public step: number = 0;
    public timeElapsed: number = 0;  // Time passed since last frame update

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

    public castShadow: boolean = false;

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

    public removeComponent(component: Component): void {
        const index = this.components.indexOf(component);

        if (index >= 0) {
            this.components.splice(index, 1);
            Game.events.emit(new EntityChanged(this));
        }
    }

    public addComponent(component: Component): void {
        this.components.push(component);

        Game.events.emit(new EntityChanged(this));
    }

    public addComponents(...components: Component[]): void {
        for (const component of components) {
            this.addComponent(component);
        }

        Game.events.emit(new EntityChanged(this));
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

    public draw(ctx: CanvasRenderingContext2D, dt: number, opacity: number) {
        const extraSize = this.position.y * 8;
        
        const screenPos = Game.worldPosToScreenPos(this.position);
        const x = screenPos.x - this.width / 2 - extraSize / 2;
        const y = screenPos.y - this.height - extraSize / 2;
        const width = this.width + extraSize;
        const height = this.height + extraSize;
        
        if (this.castShadow) {
            // Floor
            const shadowScreenPos = Game.worldPosToScreenPos(new Vector3(this.position.x, 0, this.position.z));

            const shadowX = shadowScreenPos.x;
            const shadowY = shadowScreenPos.y;

            const shadowHeight = (this.height - extraSize) / 6;
            const shadowWidth = (this.width - extraSize) / 3;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.ellipse(shadowX, shadowY, shadowWidth, shadowHeight, Math.PI, 0, 4 * Math.PI);
            ctx.fill();
        }

        ctx.imageSmoothingEnabled = false;

        let animationData = this.spirteSheetMap.find((map) => 
            map.state === this.state &&
            map.direction === this.direction
        );
        
        const xIndex = animationData?.xIndex ?? 0;
        const yIndex = animationData?.yIndex ?? 0;
        const steps = animationData?.steps ?? 0;
        const speed = animationData?.speed ?? 0;
        
        // Calculate source X and Y position in the sprite sheet
        const sourceX = (xIndex + this.step) * this.frameWidth;
        const sourceY = yIndex * this.frameHeight;
    
        // Save the current transformation matrix
        ctx.save();    

        ctx.globalAlpha = opacity;

        // Draw the specific frame from the sprite sheet
        ctx.drawImage(
            this.image,
            sourceX,
            sourceY,  
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            width,
            height
        );
        
        ctx.restore();
        
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
