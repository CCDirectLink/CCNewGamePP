export class NoGui {
	prestart() {
		const hiddenGuis = [
			sc.StatusHudGui,
			sc.CombatHudGui,
			sc.ElementHudGui,
			sc.SpChangeHudGui,
			sc.RightHudGui,
			sc.SUB_HP_EDITOR.BOSS,
			sc.SUB_HP_EDITOR.PVP,
			sc.PvpRoundGui,
		];
        
		let guis = [];

		ig.Gui.inject({
			init: function() {
				this.parent();
				guis = this.guiHooks;
			},
			onDeferredUpdate: function() {
				this.guiHooks = !sc.newgame.get('no-gui') ? guis : guis.filter(h => !hiddenGuis.some(gui => h.gui instanceof gui));
				this.parent();
				this.guiHooks = guis;
			}
		});

        
		const original = ig.ENTITY.HitNumber.spawnHitNumber;
		ig.ENTITY.HitNumber.spawnHitNumber = function(...args) {
			if (!sc.newgame.get('no-gui')) {
				return original(...args);
			}
		};
        
		ig.GUI.StatusBar.inject({
			showHpBar: function() {
				return sc.newgame.get('no-gui') && this.parent(); 
			}
		});
        
		ig.ENTITY.CrosshairDot.inject({
			update: function(...args) {
				this.parent(...args);
				if (sc.newgame.get('no-gui')) {
					this.hide();
				}
			}
		});
	}
}