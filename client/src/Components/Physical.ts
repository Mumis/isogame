import { Vector3 } from '../Util/Vector3';
import { Component } from './Component';

export class Physical extends Component {
    public constructor(
        public velocity: Vector3 = new Vector3(0, 0, 0),
        public acceleration: number = 1,
        public mass: number = 1
    ) {
        super();
    }
}
