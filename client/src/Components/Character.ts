import { Component } from './Component';

export class Character extends Component {
    constructor(
        public name: string
    ) {
        super();
    }
}