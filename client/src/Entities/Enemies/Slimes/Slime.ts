import { Entity, EntityDirection, EntityState } from '../../Entity';
import SlimeBlue from './slime-blue.png';
import { Physical } from '../../../Components/Physical';
import { Movable } from '../../../Components/Movable';
import { Stats } from '../../../Components/Stats';
import { Collidable, CubeHitbox } from '../../../Components/Collidable';
import { Vector3 } from '../../../Util/Vector3';
import { Drawable } from '../../../Components/Drawable';

export class Slime extends Entity {
    public frameHeight: number = 32;
    public frameWidth: number = 32;
    public width: number = 32;
    public height: number = 32;
    public castShadow: boolean = true;

    constructor(public position = new Vector3(3, 3, 3)) {
        super();

        this.addComponents(
            new Drawable(),
            new Stats(),
            new Physical(),
            new Collidable(new CubeHitbox(this, 0.33, 0.33, 0.5, 0, 0, 0)),
            new Movable(),
        );

        this.image.src = SlimeBlue;

        this.spirteSheetMap = [
            {
                state: EntityState.WALKING,
                direction: EntityDirection.S,
                speed: 0.8,
                steps: 6,
                xIndex: 0,
                yIndex: 0
            },
            {
                state: EntityState.WALKING,
                direction: EntityDirection.E,
                speed: 0.8,
                steps: 6,
                xIndex: 0,
                yIndex: 0
            },
            {
                state: EntityState.WALKING,
                direction: EntityDirection.W,
                speed: 0.8,
                steps: 6,
                xIndex: 0,
                yIndex: 0,
            },
            {
                state: EntityState.WALKING,
                direction: EntityDirection.N,
                speed: 0.8,
                steps: 6,
                xIndex: 0,
                yIndex: 0,
            },
            {
                state: EntityState.IDLING,
                direction: EntityDirection.S,
                speed: 0.8,
                steps: 6,
                xIndex: 0,
                yIndex: 1
            },
            {
                state: EntityState.IDLING,
                direction: EntityDirection.E,
                speed: 0.8,
                steps: 6,
                xIndex: 0,
                yIndex: 1
            },
            {
                state: EntityState.IDLING,
                direction: EntityDirection.W,
                speed: 0.8,
                steps: 6,
                xIndex: 0,
                yIndex: 1,
            },
            {
                state: EntityState.IDLING,
                direction: EntityDirection.N,
                speed: 0.8,
                steps: 6,
                xIndex: 0,
                yIndex: 1,
            }
        ];
    }
}
