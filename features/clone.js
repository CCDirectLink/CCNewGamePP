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
		sc.MainMenu.LeaLarge.inject({
			cloneGfx: new ig.Image('media/gui/Shizuka_menu.png'),
			updateDrawables(renderer) {
				if (sc.newgame.get('clone')) {
					renderer.addDraw().setGfx(this.cloneGfx, -24, 2, 9, 4, 183, 378);
				} else {
					this.parent(renderer);
				}
			}
		});
		sc.MainMenu.LeaSmall.inject({
			cloneGfx: new ig.Image('media/gui/Shizuka_menu.png'),
			updateDrawables(renderer) {
				if (sc.newgame.get('clone')) {
					renderer.addDraw().setGfx(this.cloneGfx, -16, 2, 194, 2, 126, 259);
				} else {
					this.parent(renderer);
				}
			}
		});
		sc.MapFloorButtonContainer.inject({
			cloneGfx: new ig.Image('media/gui/Shizuka_menu.png'),
			init() {
				if (sc.newgame.get('clone')) {
					this.gfx = this.cloneGfx;
				}
				this.parent();
				if (sc.newgame.get('clone')) {
					this.leaIcon.offsetX = 130;
				}
			}
		});
		sc.AreaButton.inject({
			cloneGfx: new ig.Image('media/gui/Shizuka_menu.png'),
			updateDrawables(renderer) {
				if (sc.newgame.get('clone')) {
					if(this.focus) {
						renderer.addGfx(this.gfx, -3, -2, 421, 173, 21, 21).setCompositionMode('lighter');
					}
					renderer.addGfx(this.gfx, 4, 4, 328 + this.icon, 456 + (this.activeArea ? 8 : 0), 8, 8);
					if (this.activeArea) {
						renderer.addGfx(this.gfx, 1, 2, 304, 440, 3, 3);
						renderer.addGfx(this.cloneGfx, -11, -8, 130, 424, 16, 11);
					}
				} else {
					this.parent(renderer);
				}
			}
		});
		sc.ItemStatusDefault.inject({
			cloneGfx: new ig.Image('media/gui/Shizuka_menu.png'),
			updateDrawables(renderer) {
				if (sc.newgame.get('clone')) {
					this.menuGfx = this.cloneGfx;
				}
				this.parent(renderer);
				if (sc.newgame.get('clone')) {
					renderer.addGfx(this.cloneGfx, 0, 0, 128, 472, 126, 35);
				}
			}
		});
		sc.StatusViewMainParameters.inject({
			cloneGfx: new ig.Image('media/gui/Shizuka_menu.png'),
			updateDrawables(renderer) {
				if (sc.newgame.get('clone')) {
					this.menuGfx = this.cloneGfx;
				}
				this.parent(renderer);
				if (sc.newgame.get('clone')) {
					renderer.addGfx(this.cloneGfx, 0, 0, 128, 472, 126, 35);
				}
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