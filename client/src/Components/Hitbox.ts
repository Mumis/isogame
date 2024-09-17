import { Component } from './Component';

export class BoxHitbox {
    constructor(public width: number, public depth: number, public height: number) {

    }
}

export class CircleHitbox {
    constructor(public radius: number) {

    }
}

export type HitboxType = 
    BoxHitbox | CircleHitbox;

export class Hitbox extends Component {
    public constructor(
        public box: BoxHitbox | CircleHitbox
    ) {
        super();
    }
}
