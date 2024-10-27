import { Component } from './Component';

export class Stats extends Component {
    public constructor(
        public health = {
            max: 100,
            current: 100,
            regen: 1
        },

        public mana = {
            max: 100,
            current: 100,
            regen: 1
        },

        public stamina = {
            max: 100,
            current: 100,
            regen: 1
        },

        public speed = {
            max: 100,
            current: 100,
            regen: 1
        }
    ) {
        super();
    }
}
