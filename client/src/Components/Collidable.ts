import { Vector3 } from '../Util/Vector3';
import { Component } from './Component';

export class CubeHitbox {
    constructor(public width: number, public depth: number, public height: number, public position: Vector3) {}

    public intersectAABB(b: CubeHitbox) {
        const aMinX = this.position.x - this.width;
        const aMaxX = this.position.x;
        const aMinY = this.position.y;
        const aMaxY = this.position.y + this.height;
        const aMinZ = this.position.z - this.depth;
        const aMaxZ = this.position.z;

        const bMinX = b.position.x - b.width;
        const bMaxX = b.position.x;
        const bMinY = b.position.y;
        const bMaxY = b.position.y + this.height;
        const bMinZ = b.position.z - b.depth;
        const bMaxZ = b.position.z;

        return (
            aMinX <= bMaxX &&
            aMaxX >= bMinX &&
            aMinY <= bMaxY &&
            aMaxY >= bMinY &&
            aMinZ <= bMaxZ &&
            aMaxZ >= bMinZ
        );
    }

    public getIntersectArea(b: CubeHitbox): any {
        const aMinX = this.position.x - this.width;
        const aMaxX = this.position.x;
        const aMinY = this.position.y;
        const aMaxY = this.position.y + this.height;
        const aMinZ = this.position.z - this.depth;
        const aMaxZ = this.position.z;

        const bMinX = b.position.x - b.width;
        const bMaxX = b.position.x;
        const bMinY = b.position.y;
        const bMaxY = b.position.y + this.height;
        const bMinZ = b.position.z - b.depth;
        const bMaxZ = b.position.z;

        const min = {x: Math.max(aMinX, bMinX), y: Math.max(aMinY, bMinY), z: Math.max(aMinZ, bMinZ)};
        const max = {x: Math.min(aMaxX, bMaxX), y: Math.min(aMaxY, bMaxY), z: Math.min(aMaxZ, bMaxZ)};

        const object = {
            min: min,
            max: max,
        };

        return object;
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
