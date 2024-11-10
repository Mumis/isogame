import { Entity } from '../../Entities/Entity';
import { Game } from '../../Game/Game';

export class Ability {
    public cooldown: number = 1;
    public timeUntilReady: number = 0;
    private lastTimestamp: number | null = null;

    public image: HTMLImageElement = new Image();

    constructor() {}

    private updateCooldown() {
        this.timeUntilReady = this.cooldown;

        const reduceTimeUntilReady = (timestamp: number) => {
            if (this.lastTimestamp === null) {
                this.lastTimestamp = timestamp;
            }

            const dt = (timestamp - this.lastTimestamp) / 1000;

            this.lastTimestamp = timestamp;
            this.timeUntilReady -= dt;

            console.log(this.timeUntilReady)

            if (this.timeUntilReady > 0) {
                requestAnimationFrame(reduceTimeUntilReady);
            } else {
                this.timeUntilReady = 0;
            }
        };

        requestAnimationFrame(reduceTimeUntilReady);
    }

    public cast(caster: Entity, game: Game) {
        if (this.timeUntilReady === 0) {
            this.lastTimestamp = null;
            this.onCast(caster, game);
            this.updateCooldown();
        }
    }

    private NPCBehavior() {
        // Intentionally left empty
    }

    public onCast(caster: Entity, game: Game): void {
        throw new Error('Not implemented');
    }
}
