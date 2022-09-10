const ROUND_TIMER = 3;
const MOVE_SPEED = 0.3;

export class Tactician {
    constructor() {
        this.timer = 0;
        this.playerTurn = true;
        this.influenceEntry = null;
        this.timerGUI = null;
    }

    prestart() {
        ig.ENTITY.Player.inject({
            gatherInput() {
                return this.parent();
            }
        });

        const self = this;
        sc.PlayerModel.inject({
            getCore(core) {
                if (sc.newgame.get('tactician') && ig.game.playerEntity && sc.combat.isInCombat(ig.game.playerEntity) && !self.playerTurn) {
                    return core === sc.PLAYER_CORE.MOVE || core === sc.PLAYER_CORE.GUARD;
                }
                return this.parent(core);
            }
        });

        ig.ENTITY.Combatant.inject({
            isShielded(a, b, c, d) {
                const originalDamageFactor = d.damageFactor;
                const result = this.parent(a, b, c, d);

                if (sc.newgame.get('tactician') 
                && ig.game.playerEntity 
                && sc.combat.isInCombat(ig.game.playerEntity) 
                && !self.playerTurn
                && result === sc.SHIELD_RESULT.REGULAR) {
                    d.damageFactor = originalDamageFactor;
                }
                
                return result;
            }
        });

        sc.Control.inject({
            moveDir(vec, ...args) {
                const result = this.parent(vec, ...args);
                
                if (sc.newgame.get('tactician') 
                && ig.game.playerEntity 
                && sc.combat.isInCombat(ig.game.playerEntity) 
                && !self.playerTurn) {
                    vec.x *= MOVE_SPEED;
                    vec.y *= MOVE_SPEED;

                    return result * MOVE_SPEED;
                }

                return result;
            }
        });

        sc.COMBAT_SHIELDS.PLAYER.inject({
            isActive(...args) {
                return this.parent(...args);
            }
        });

        this.timerGUI = ig.GuiElementBase.extend({
            gfx: new ig.Image("media/gui/menu.png"),
            transitions: {
                DEFAULT: {
                    state: {
                        alpha: 0.3
                    },
                    time: 2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0
                    },
                    time: 2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            },
            init() {
                this.parent();

                this.doStateTransition("DEFAULT");
            },

            updateDrawables(renderer) {
                if (sc.newgame.get('tactician') 
                && ig.game.playerEntity 
                && sc.combat.isInCombat(ig.game.playerEntity)) {
                    const percent = self.playerTurn 
                        ? self.timer / ROUND_TIMER
                        : 1 - (self.timer / ROUND_TIMER);
    
                    renderer.addGfx(this.gfx, 0, 0, 0, 0, 16, percent * 320);
                    renderer.addGfx(this.gfx, ig.system.width - 16, 0, 0, 0, 16, percent * 320);
                }
            }
        });
    }

	main() {
		ig.game.addons.postUpdate.push(this);
		ig.game.addons.levelLoaded.push(this);

        ig.gui.addGuiElement(new this.timerGUI());
	}
    
	onPostUpdate() {
        if (!sc.newgame.get('tactician')) {
            return
        }
        
        if (!ig.game.playerEntity || !sc.combat.isInCombat(ig.game.playerEntity)) {
            ig.slowMotion.clearNamed('playerTurn');
            return;
        }

        this.timer -= ig.system.tick * (1 / ig.system.timeFactor);
        if (this.timer <= 0) {
            this.timer = ROUND_TIMER;
            this.playerTurn = !this.playerTurn;

            if (this.playerTurn) {
                //ig.game.playerEntity.influencer.removeInfluence(this.influenceEntry);

                const slowmo = ig.slowMotion.add(0.0001, 0, 'playerTurn');
                slowmo.addInverseEntity(ig.game.playerEntity);
            } else {
                ig.slowMotion.clearNamed('playerTurn');

                //ig.game.playerEntity.influencer.addInfluence(this.influenceEntry);
            }
        }

        if (ig.game.playerEntity.hasShield()
        && sc.combat.isInCombat(ig.game.playerEntity)
        && !this.playerTurn) {
            for (const shield of ig.game.playerEntity.shieldsConnections) {
                if (!shield.perfectGuardTime) {
                    ig.game.playerEntity.removeShield(shield);
                    ig.game.playerEntity.guard.fxHandle && ig.game.playerEntity.guard.fxHandle.stop();
                    ig.game.playerEntity.guard.fxHandle = ig.game.playerEntity.guard.fxSheet.spawnOnTarget("guardBroken", ig.game.playerEntity, {
                        duration: -1
                    });
                    sc.combat.doDramaticEffect(ig.game.playerEntity, ig.game.playerEntity, {
                        timeFactor: 0.1,
                        wait: 0.4,
                        //label: "sc.gui.combat-msg.guard-break",
                        clearTime: 0.1,
                        zoom: 1,
                        camera: 0,
                        blurDuration: 0.3,
                        blurType: "LIGHT",
                        speedlines: false
                    });
                }
            }
        }
	}

    onLevelLoaded() {
        if (!sc.newgame.get('tactician')) {
            return
        }

        this.playerTurn = false;
        this.timer = 0;
    }
}