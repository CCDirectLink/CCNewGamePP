export class ChargedOnly {
	prestart() {
		ig.ENTITY.Player.inject({
			/**
             * @param {'THROW_NORMAL' | 'THROW_CHARGED' | 'THROW_NORMAL_REV' | 'THROW_CHARGED_REV' | 'THROW_SPECIAL1'} type
             */
			startThrowAction(type, data) {
				if (sc.newgame.get('charged-only')
                && this.model.getCore(sc.PLAYER_CORE.GUARD)
                && (type === 'THROW_NORMAL' || type === 'THROW_NORMAL_REV')) {
					this.quickStateSwitch(0);
					return;
				}
                
				this.parent(type, data);
			}
		});
	}
}