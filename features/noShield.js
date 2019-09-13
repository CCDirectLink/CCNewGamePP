export class NoShield {
	prestart() {
		sc.PlayerModel.inject({
			/**
			 * 
			 * @param {number} id
			 * @returns {boolean} enabled
			 */
			getCore(id) {
				if (sc.newgame.get('no-shield')
                && id === sc.PLAYER_CORE.GUARD
                && !ig.game.mapName.startsWith('cargo-ship')) {
					return false;
				}

				return this.parent(id);
			},
		});
	}
}