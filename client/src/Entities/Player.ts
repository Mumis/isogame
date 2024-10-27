

import { Entity, EntityDirection, EntityState } from './Entity';
import PlayerSprite from './Enemies/Slimes/slime-blue.png';
import { Physical } from '../Components/Physical';
import { Movable } from '../Components/Movable';
import { Stats } from '../Components/Stats';
import { BoxHitbox, Hitbox } from '../Components/Hitbox';

export class Player extends Entity {
    public frameHeight: number = 32;
    public frameWidth: number = 32;
    public width: number = 32;
    public height: number = 32;

    constructor() {
        super();

        this.addComponents(
            new Stats(),
            new Physical(),
            new Hitbox(
                new BoxHitbox(this.width, this.height / 1.5, this.height / 1.5),
            ),
            new Movable()
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
