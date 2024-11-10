import { Ability } from './Ability';
import Slash from '../../../assets/skills/Slash.png';
import { Entity } from '../../Entities/Entity';
import { Game } from '../../Game/Game';

export class Slash extends Ability {
    constructor() {
        super();

        this.image.src = Slash;
    }

    public onCast(caster: Entity, game: Game) {
    }
}