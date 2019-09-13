export class Invincible {
	prestart() {
		ig.ENTITY.Player.inject({
			onPreDamageModification(...args) {
				const data = args[4];
				if (data && sc.newgame.get('invincible')) {
					data.damage = 0;

					// Workaround for M.S. Solar
					if (this.model.getCore(sc.PLAYER_CORE.GUARD)) {
						ig.vars.add('playerVar.input.shieldedHits', 1); 
					} else {
						ig.vars.add('playerVar.input.hits', 1);
					}
					return false;
				}
				return this.parent(...args);
			}
		});
	}
}