import { Ability } from './Ability';
import Dash from '../../../assets/skills/dash.png';
import { Entity } from '../../Entities/Entity';
import { Game } from '../../Game/Game';
import { Physical } from '../Physical';
import { Vector3 } from '../../Util/Vector3';

export class Dash extends Ability {
    public cooldown: number = 4;

    constructor() {
        super();

        this.image.src = Dash;
    }

    public onCast(caster: Entity, game: Game) {
        if (caster.hasComponent(Physical)) {
            const physical = caster.getComponent(Physical);
            
            physical.velocity = physical.velocity.multiplyScalar(2).add(new Vector3(0, 20, 0));
        }
    }
}