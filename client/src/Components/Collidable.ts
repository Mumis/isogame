import { Entity } from '../Entities/Entity';
import { Vector3 } from '../Util/Vector3';
import { Component } from './Component';

export interface IntersectArea {
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    minZ: number,
    maxZ: number
}

export class CubeHitbox {
    constructor(
        public attached: Entity,
        private width: number, 
        private depth: number, 
        private height: number, 
        private offsetX: number = 0,
        private offsetY: number = 0,
        private offsetZ: number = 0
    ) {}

    public getBoundingBox() {
        return {
            minX: this.attached.position.x + this.offsetX - this.width / 2,
            maxX: this.attached.position.x + this.offsetX + this.width / 2,
            minY: this.attached.position.y + this.offsetY - this.height,
            maxY: this.attached.position.y + this.offsetY,
            minZ: this.attached.position.z + this.offsetZ - this.depth / 2,
            maxZ: this.attached.position.z + this.offsetZ + this.depth / 2
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

    public intersectAABB(b: CubeHitbox): IntersectArea | null {
        const box1 = this.getBoundingBox();
        const box2 = b.getBoundingBox();

        const minX = Math.max(box1.minX, box2.minX);
        const maxX = Math.min(box1.maxX, box2.maxX);
        const minY = Math.max(box1.minY, box2.minY);
        const maxY = Math.min(box1.maxY, box2.maxY);
        const minZ = Math.max(box1.minZ, box2.minZ);
        const maxZ = Math.min(box1.maxZ, box2.maxZ);

        if (minX < maxX && minY < maxY && minZ < maxZ) {
            return {
                minX: minX,
                maxX: maxX,
                minY: minY,
                maxY: maxY,
                minZ: minZ,
                maxZ: maxZ
            };
        }

        return null;
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
        public box: CubeHitbox | SphereHitbox
    ) {
        super();
    }
}
