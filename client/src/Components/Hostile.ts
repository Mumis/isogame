import { Component } from './Component';

export class Physical extends Component {
    public constructor(
        public velocity: [number, number, number] = [0, 0, 0],
        public acceleration: number = 1,
        public mass: number = 1
    ) {
        super();
    }
}
