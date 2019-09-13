export class Clone {
	prestart() {
		ig.EVENT_STEP.SWITCH_PLAYER_CONFIG.inject({
			start() {
				if (sc.newgame.get('clone')) {
					this.name = 'Shizuka';
				}

				this.parent();
			}
		});
	}
    
	main() {
		ig.Game.inject({
			loadLevel: function(...args) {
				const result = this.parent(...args);
                
				if (sc.newgame.get('clone')) {
					const event = new ig.EVENT_STEP.SWITCH_PLAYER_CONFIG({name: 'Shizuka'});
					event.start();
				}
                
				return result;
			}
		});
	}
}