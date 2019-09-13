export class NoDash {
	prestart() {
		ig.ENTITY.Player.inject({
			/**
			 * @returns {number}
			 */
			getMaxDashes(id) {
				if (sc.newgame.get('no-dash')) {
					return 0;
				}

				return this.parent(id);
			},
		});
        
		sc.CombatParams.inject({
			/**
             * 
             * @param {string} name
             * @returns {number}
             */
			getModifier(name) {
				if (name === 'DASH_STEP'
                && sc.newgame.get('no-dash')) {
					return 0;
				}
                
				return this.parent(name);
			}
		});
	}
}