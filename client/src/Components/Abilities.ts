import { Entity } from '../Entities/Entity';
import { Game } from '../Game/Game';
import { Component } from './Component';
import { Ability } from './ability/Ability';

export class Abilities extends Component {
    constructor(
        public caster: Entity,
        public activeSet: Ability[] = [], 
        public maxAmount: number = 8
    ) {
        super();
    }

    public castAbility(index: number, game: Game) {
        this.activeSet[index].cast(this.caster, game);
    }
}