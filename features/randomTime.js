export class RandomTime {
    prestart() {
        ig.SlowMotion.inject({
            update() {
                let factor = Number.MAX_SAFE_INTEGER;
                let randomFactor = Number.MAX_SAFE_INTEGER;
                for (const slowMotion of this.slowMotions) {
                    if (slowMotion.update()) {
                        if (slowMotion.name) {
                            delete this.namedSlowMotions[slowMotion.name];
                        }
                        this.slowMotions.splice(this.slowMotions.indexOf(slowMotion), 1);
                    } else if (slowMotion.name === 'randomTime'){
                        factor = slowMotion.getFactor();
                    } else {
                        factor = Math.min(factor, slowMotion.getFactor());
                    } 
                }

                factor = randomFactor !== Number.MAX_SAFE_INTEGER ? randomFactor : factor !== Number.MAX_SAFE_INTEGER ? factor : 1;
                ig.system.setTimeFactor(factor);
            }
        });

        ig.SlowMotionHandle.inject({
            transitionInitial: 1,
            inverse: false,
            getFactor() {
                let timeFactor = this.transitionTime ? this.timer / this.transitionTime : 0;
                if (this.cleared || this.inverse)  {
                    timeFactor = 1 - timeFactor;
                }
                return (1 - timeFactor) * this.transitionInitial + timeFactor * this.factor;
            },
        })
    }

	main() {
		ig.game.addons.postUpdate.push(this);

        this.slowmo = ig.slowMotion.add(1, 0);
        this.slowmo.name = 'randomTime';
        this.slowmo.inverse = true;
	}

	onPostUpdate() {
        if (!sc.newgame.get('random-time')) {
            return
        }

        this._updateSlowmo();
        this._registerGlobalStatic();

        if (!ig.slowMotion.slowMotions.includes(this.slowmo)) {
            ig.slowMotion.slowMotions.push(this.slowmo);
        }
	}

    _registerGlobalStatic() {
		const player = ig.game.playerEntity;
        if (!player || player.coll.time.randomTimeHook) {
            return;
        }
        player.coll.time.randomTimeHook = true;

        let value = player.coll.time.globalStatic;
        Object.defineProperty(player.coll.time, 'globalStatic', {
            configurable: true,
            enumerable: false,
            get: () => {
                if (this._hasSlowmotion()) {
                    return value;
                }

                return true;
            },
            set: (val) => {
                value = val;
            }
        });
    }

    _hasSlowmotion() {
        if (ig.slowMotion.slowMotions.count <= 2) {
            return false;
        }

        for (const slowMotion of ig.slowMotion.slowMotions) {
            if (slowMotion.name !== 'randomTime' && slowMotion.faktor !== 1) {
                return true;
            }
        }
        return false;
    }

    _updateSlowmo() {
        if (!this.slowmo || this.slowmo.timer > 0) {
            return;
        }

        const time = Math.random() + 0.5;

        this.slowmo.transitionInitial = this.slowmo.factor;
        this.slowmo.timer = this.slowmo.transitionTime = time;
        this.slowmo.factor = (Math.random() * 1.5) ** 2 + 0.001;
    }
}