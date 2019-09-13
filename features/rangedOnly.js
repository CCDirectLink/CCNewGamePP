export class RangedOnly {
	prestart() {
		sc.PlayerModel.inject({
			/**
			 * 
			 * @param {number} id
			 * @returns {boolean} enabled
			 */
			getCore(id) {
				if (sc.newgame.get('ranged-only')
				&& id === sc.PLAYER_CORE.CLOSE_COMBAT
				&& this.getCore(sc.PLAYER_CORE.THROWING)) {
					return false;
				}

				return this.parent(id);
			},
		});
	}
}