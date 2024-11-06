export class Vector3 {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0
    ) {}

    public floor(): Vector3 {
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    // Add two vectors
    public add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    // Subtract two vectors
    public subtract(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    // Multiply vector by a scalar
    public multiplyScalar(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    // Divide vector by a scalar
    public divideScalar(scalar: number): Vector3 {
        if (scalar === 0) {
            throw new Error("Division by zero");
        }
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    // Get the length (magnitude) of the vector
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // Normalize the vector (make its length 1)
    public normalize(): Vector3 {
        const len = this.length();
        if (len === 0) {
            return new Vector3(0, 0, 0); // Return zero vector for a zero-length vector
        }
        return this.divideScalar(len);
    }

    // Dot product of two vectors
    public dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    // Cross product of two vectors
    public cross(v: Vector3): Vector3 {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    // Calculate the distance between two vectors
    public distanceTo(v: Vector3): number {
        return Math.sqrt(
            (this.x - v.x) ** 2 + (this.y - v.y) ** 2 + (this.z - v.z) ** 2
        );
    }

    // Calculate the squared distance (more efficient when only comparing distances)
    public distanceSquared(v: Vector3): number {
        return (this.x - v.x) ** 2 + (this.y - v.y) ** 2 + (this.z - v.z) ** 2;
    }

    // Linear interpolation between two vectors
    public lerp(v: Vector3, t: number): Vector3 {
        return this.add(v.subtract(this).multiplyScalar(t));
    }

    // Create a copy of the vector
    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    // Check equality of two vectors
    public equals(v: Vector3): boolean {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    // String representation of the vector
    public toString(): string {
        return `Vector3(${this.x}, ${this.y}, ${this.z})`;
    }

    // Zero vector
    public static zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    // Unit vector along the X axis
    public static unitX(): Vector3 {
        return new Vector3(1, 0, 0);
    }

    // Unit vector along the Y axis
    public static unitY(): Vector3 {
        return new Vector3(0, 1, 0);
    }

    // Unit vector along the Z axis
    public static unitZ(): Vector3 {
        return new Vector3(0, 0, 1);
    }
}