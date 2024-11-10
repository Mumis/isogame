

import { Entity, EntityDirection, EntityState } from './Entity';
import PlayerSprite from './Enemies/Slimes/slime-blue.png';
import { Physical } from '../Components/Physical';
import { Movable } from '../Components/Movable';
import { Stats } from '../Components/Stats';
import { Collidable, CubeHitbox } from '../Components/Collidable';
import { Drawable } from '../Components/Drawable';
import { Game } from '../Game/Game';
import tile30 from '../../assets/tiles/tile_30.png';
import { Vector3 } from '../Util/Vector3';
import { Abilities } from '../Components/Abilities';
import { Dash } from '../Components/ability/Dash';
import { Slash } from '../Components/ability/Slash';
import { Ability } from '../Components/ability/Ability';

export class Player extends Entity {
    public frameHeight = 32;
    public frameWidth = 32;
    public width = 32;
    public height = 32;
    public position = new Vector3(3, 3, 3);
    public castShadow = true;

    constructor() {
        super();

        this.addComponents(
            //new Drawable(),
            new Abilities(this, [
                new Slash(),
                new Dash()
            ]),
            new Stats(),
            new Physical(),
            new Collidable(
                new CubeHitbox(this, 0.33, 0.33, 0.5, 0, 0, 0)
            ),
            new Movable(),
        );

        this.image.src = PlayerSprite;

        // this.spirteSheetMap = [
        //     {
        //         state: EntityState.IDLING,
        //         direction: EntityDirection.S,
        //         speed: 0.5,
        //         steps: 4,
        //         xIndex: 0,
        //         yIndex: 0
        //     },
        //     {
        //         state: EntityState.IDLING,
        //         direction: EntityDirection.E,
        //         speed: 0.5,
        //         steps: 4,
        //         xIndex: 0,
        //         yIndex: 1 
        //     },
        //     {
        //         state: EntityState.IDLING,
        //         direction: EntityDirection.W,
        //         speed: 0.5,
        //         steps: 4,
        //         xIndex: 0,
        //         yIndex: 1
        //     },
        //     {
        //         state: EntityState.IDLING,
        //         direction: EntityDirection.N,
        //         speed: 0.5,
        //         steps: 4,
        //         xIndex: 0,
        //         yIndex: 2
        //     },
        //     {
        //         state: EntityState.WALKING,
        //         direction: EntityDirection.S,
        //         speed: 0.5,
        //         steps: 4,
        //         xIndex: 0,
        //         yIndex: 3
        //     },
        //     {
        //         state: EntityState.WALKING,
        //         direction: EntityDirection.E,
        //         speed: 0.5,
        //         steps: 4,
        //         xIndex: 0,
        //         yIndex: 4
        //     },
        //     {
        //         state: EntityState.WALKING,
        //         direction: EntityDirection.W,
        //         speed: 0.5,
        //         steps: 4,
        //         xIndex: 0,
        //         yIndex: 4
        //     },
        //     {
        //         state: EntityState.WALKING,
        //         direction: EntityDirection.N,
        //         speed: 0.5,
        //         steps: 4,
        //         xIndex: 0,
        //         yIndex: 5
        //     },
        // ];

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
