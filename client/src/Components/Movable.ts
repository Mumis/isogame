import { Component } from './Component';

export class Movable extends Component {
    public patrollingTo: [number, number, number] | null = null;
    // public waitTime = 0;
    // public jumping = false;

    public constructor(
        public vector: [number, number, number] = [0, 0, 0],
        public patrolling: boolean = false,
        public patrollingSettings: {
            originalPosition: [number, number, number],
            radius: number
        }
        // public randomMovements: boolean = false,
        // public randomMovementSettings: {
        //     originalPosition: [number, number, number],
        //     radius: number,
        //     waitDuration: number,
        //     moveLength: number
        // } = {
        //     originalPosition: [0, 0, 0],
        //     radius: 10,
        //     waitDuration: 5,
        //     moveLength: 5
        // }
    ) {
        super();
    }
}
