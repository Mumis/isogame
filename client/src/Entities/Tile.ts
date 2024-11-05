import { Entity } from './Entity';
import { Game } from '../Game/Game';
import { Vector3 } from '../Util/Vector3';

// Import all 30 tile images
import tile0 from '../../assets/tiles/tile_0.png';
import tile1 from '../../assets/tiles/tile_1.png';
import tile2 from '../../assets/tiles/tile_2.png';
import tile3 from '../../assets/tiles/tile_3.png';
import tile4 from '../../assets/tiles/tile_4.png';
import tile5 from '../../assets/tiles/tile_5.png';
import tile6 from '../../assets/tiles/tile_6.png';
import tile7 from '../../assets/tiles/tile_7.png';
import tile8 from '../../assets/tiles/tile_8.png';
import tile9 from '../../assets/tiles/tile_9.png';
import tile10 from '../../assets/tiles/tile_10.png';
import tile11 from '../../assets/tiles/tile_11.png';
import tile12 from '../../assets/tiles/tile_12.png';
import tile13 from '../../assets/tiles/tile_13.png';
import tile14 from '../../assets/tiles/tile_14.png';
import tile15 from '../../assets/tiles/tile_15.png';
import tile16 from '../../assets/tiles/tile_16.png';
import tile17 from '../../assets/tiles/tile_17.png';
import tile18 from '../../assets/tiles/tile_18.png';
import tile19 from '../../assets/tiles/tile_19.png';
import tile20 from '../../assets/tiles/tile_20.png';
import tile21 from '../../assets/tiles/tile_21.png';
import tile22 from '../../assets/tiles/tile_22.png';
import tile23 from '../../assets/tiles/tile_23.png';
import tile24 from '../../assets/tiles/tile_24.png';
import tile25 from '../../assets/tiles/tile_25.png';
import tile26 from '../../assets/tiles/tile_26.png';
import tile27 from '../../assets/tiles/tile_27.png';
import tile28 from '../../assets/tiles/tile_28.png';
import tile29 from '../../assets/tiles/tile_29.png';
import tile30 from '../../assets/tiles/tile_30.png';
import { Collidable, CubeHitbox } from '../Components/Collidable';

// Map each tile number to its corresponding image
const imageMap: { [key: number]: string } = {
    0: tile0,
    1: tile1,
    2: tile2,
    3: tile3,
    4: tile4,
    5: tile5,
    6: tile6,
    7: tile7,
    8: tile8,
    9: tile9,
    10: tile10,
    11: tile11,
    12: tile12,
    13: tile13,
    14: tile14,
    15: tile15,
    16: tile16,
    17: tile17,
    18: tile18,
    19: tile19,
    20: tile20,
    21: tile21,
    22: tile22,
    23: tile23,
    24: tile24,
    25: tile25,
    26: tile26,
    27: tile27,
    28: tile28,
    29: tile29,
    30: tile30,
};

export class Tile extends Entity {
    public frameHeight: number = 32;
    public frameWidth: number = 32;
    public width: number = Game.TILE_SIZE_WIDTH;
    public height: number = Game.TILE_SIZE_WIDTH;

    constructor(
        public tileNum: number,
        public position: Vector3,
        public zIndex: number
    ) {
        super();

        // Access the image URL based on tileNum
        this.image.src = imageMap[this.tileNum];

        //this.addComponent(new Collidable(new CubeHitbox(1, 1, 0.5, this.position), true));
    }

    public draw(ctx: CanvasRenderingContext2D, dt: number, opacity: number) {
        const screenPos = Game.worldPosToScreenPos(this.position, -this.width / 2, this.height / -2);
        const width = this.width;
        const height = this.height;

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
            screenPos.x,    
            screenPos.y,
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