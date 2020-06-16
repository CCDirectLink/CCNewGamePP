export class Overdrive {
	prestart() {
		ig.ENTITY.Player.inject({
			/**
             * @param {string} type
             */
			doCombatAction(type) {
				if (sc.newgame.get('overdrive')
					&& this.model.level > 1) {
					if (type === 'THROW_NORMAL' || type === 'THROW_NORMAL_REV') {
						this._setDefaultArts();
						type = 'THROW_SPECIAL1';
					} else if (type === 'THROW_CHARGED' || type === 'THROW_CHARGED_REV') {
						if (ig.EntityTools.getGroundEntity(this) instanceof ig.ENTITY.KeyPanel) {
							return this.parent(type);
						}
						this._setDefaultArts();
						type = 'THROW_SPECIAL2';
					} else if (type === 'ATTACK' || type === 'ATTACK_REV') {
						this._setDefaultArts();
						type = 'ATTACK_SPECIAL1';
					}
				}

				this.parent(type);
			},

			startDash() {
				this.parent();

				if (sc.newgame.get('overdrive')
					&& this.level <= 1) {
					this._setDefaultArts();
					this.doCombatAction('DASH_SPECIAL1');
				}
			},

			/**
             * 
             * @param {{guarding: boolean}} options
             */
			handleGuard(options, data) {
				this.parent(options, data);

				if (sc.newgame.get('overdrive')
					&& this.model.level > 1
					&& options.guarding) {
					this._setDefaultArts();
					this.doCombatAction('GUARD_SPECIAL1');
				}
			},

			_setDefaultArts() {
				this._setDefaultElementArts(sc.ELEMENT.NEUTRAL);
				this._setDefaultElementArts(sc.ELEMENT.HEAT);
				this._setDefaultElementArts(sc.ELEMENT.COLD);
				this._setDefaultElementArts(sc.ELEMENT.SHOCK);
				this._setDefaultElementArts(sc.ELEMENT.WAVE);
			},

			/**
             * 
             * @param {number} element 
             */
			_setDefaultElementArts(element) {
				this._setDefaultElementArt(element, sc.PLAYER_ACTION.ATTACK_SPECIAL1, 'ATTACK_SPECIAL1_A');
				this._setDefaultElementArt(element, sc.PLAYER_ACTION.ATTACK_SPECIAL2, 'ATTACK_SPECIAL2_A');
				this._setDefaultElementArt(element, sc.PLAYER_ACTION.THROW_SPECIAL1, 'THROW_SPECIAL1_A');
				this._setDefaultElementArt(element, sc.PLAYER_ACTION.THROW_SPECIAL2, 'THROW_SPECIAL2_A');
				this._setDefaultElementArt(element, sc.PLAYER_ACTION.DASH_SPECIAL1, 'DASH_SPECIAL1_A');
				this._setDefaultElementArt(element, sc.PLAYER_ACTION.DASH_SPECIAL2, 'DASH_SPECIAL2_A');
				this._setDefaultElementArt(element, sc.PLAYER_ACTION.GUARD_SPECIAL1, 'GUARD_SPECIAL1_A');
				this._setDefaultElementArt(element, sc.PLAYER_ACTION.GUARD_SPECIAL2, 'GUARD_SPECIAL2_A');
			},

			/**
             * @param {number} element
             * @param {number} action
             * @param {string} defaultName
             */
			_setDefaultElementArt(element, action, defaultName) {
				if (!this.model.elementConfigs[element].activeActions[action]) {
					this.model.elementConfigs[element].activeActions[action] = this.model.elementConfigs[element].actions[defaultName];
				}
			}
		});
	}
}