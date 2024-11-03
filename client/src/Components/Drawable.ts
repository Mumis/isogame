import { Entity } from '../Entities/Entity';
import { Component } from './Component';

export class Drawable extends Component {
    public opacity = 1;
    public fadeInElapsed = 0;
    public fadeOut = false;
    public fadeOutElapsed = 0;
    public readonly fadeDuration = 0.5; //seconds

    public constructor(public fadeIn: boolean = false) {
        super();
        if (fadeIn) {
            this.opacity = 0;
        }
    }
}