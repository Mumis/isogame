import { Vector3 } from '../Util/Vector3';
import { Component } from './Component';

export class CubeHitbox {
    constructor(
        private width: number, 
        private depth: number, 
        private height: number, 
        private position: Vector3,
        private offsetX: number = 0,
        private offsetY: number = 0,
        private offsetZ: number = 0
    ) {}

    public getBoundingBox() {
        return {
            minX: this.position.x + this.offsetX - this.width / 2,
            maxX: this.position.x + this.offsetX + this.width / 2,
            minY: this.position.y + this.offsetY - this.height,
            maxY: this.position.y + this.offsetY,
            minZ: this.position.z + this.offsetZ - this.depth / 2,
            maxZ: this.position.z + this.offsetZ + this.depth / 2
        }
    }

    public getCorners(): Vector3[] {
        const { minX, maxX, minY, maxY, minZ, maxZ } = this.getBoundingBox();
    
        return [
            new Vector3(minX, minY, minZ), // Bottom-front-left
            new Vector3(maxX, minY, minZ), // Bottom-front-right
            new Vector3(maxX, minY, maxZ), // Bottom-back-right
            new Vector3(minX, minY, maxZ), // Bottom-back-left
            new Vector3(minX, maxY, minZ), // Top-front-left
            new Vector3(maxX, maxY, minZ), // Top-front-right
            new Vector3(maxX, maxY, maxZ), // Top-back-right
            new Vector3(minX, maxY, maxZ), // Top-back-left
        ];
    }

    public intersectAABB(b: CubeHitbox) {
        const box1 = this.getBoundingBox();
        const box2 = b.getBoundingBox();

        return (
            box1.minX <= box2.maxX &&
            box1.maxX >= box2.minX &&
            box1.minY <= box2.maxY &&
            box1.maxY >= box2.minY &&
            box1.minZ <= box2.maxZ &&
            box1.maxZ >= box2.minZ
        );
    }

    public overlapAABB(b: CubeHitbox) {
        const box1 = this.getBoundingBox();
        const box2 = b.getBoundingBox();

        const overlapX = Math.min(box1.maxX - box2.minX, box2.maxX - box1.minX);
        const overlapY = Math.min(box1.maxY - box2.minY, box2.maxY - box1.minY);
        const overlapZ = Math.min(box1.maxZ - box2.minZ, box2.maxZ - box2.minZ);

        return new Vector3(overlapX, overlapY, overlapZ);
    }
}

export class SphereHitbox {
    constructor(public radius: number, position: Vector3) {

    }
}

export type HitboxType = CubeHitbox | SphereHitbox;

export class Collidable extends Component {
    public constructor(
        public box: CubeHitbox | SphereHitbox, 
        public stationary: boolean = false
    ) {
        super();
    }
}
