export class NoDeath {
	prestart() {
		ig.Game.inject({
			loadLevel: function(newMap, oldMap) {
				if (sc.newgame.get('no-death')) {
					if (!ig.vars.storage.mods) {
						ig.vars.storage.mods = {};
					}
					if (!ig.vars.storage.mods.newgamepp) {
						ig.vars.storage.mods.newgamepp = {};
					}
					if (!ig.vars.storage.mods.newgamepp.id) {
						ig.vars.storage.mods.newgamepp.id = Math.random() + 1; //Avoid 0
					}
				}

				return this.parent(newMap, oldMap);
			}
		});
	}

	main() {
		const original = window.SHOW_SAVE_DIALOG;
		window.SHOW_SAVE_DIALOG = (...args) => {
			if (sc.newgame.get('no-death')) {
				return;
			}
			original(...args);
		};
        
		const respawn = ig.game.respawn;
		ig.game.respawn = (...args) => {
			if (sc.newgame.get('no-death')) {
				this._delete(ig.vars.storage.mods.newgamepp.id);
				sc.Dialogs.showChoiceDialog('You are dead!\nDo you want to delete your save?', sc.DIALOG_INFO_ICON.WARNING, [ig.lang.get('sc.gui.dialogs.yes')], () => ig.game.gotoTitle());
				this._playDeathAnimation();
				return;
			}

			respawn.apply(ig.game, args);
		};
	}

	/**
	 * 
	 * @param {number} id 
	 */
	_delete(id) {
		for (let i = ig.storage.slots.length - 1; i >= 0; i--) {
			if (this._containsGame(ig.storage.slots[i], id)) {
				sc.menu.deleteSlot(i);
			}
		}

		if (this._containsGame(ig.storage.autoSlot, id)) {
			ig.storage.autoSlot = null;

			if (ig.storage.slots.length !== 0) {
				ig.storage.lastUsedSlot = ig.storage.slots.length - 1;
			}
		}
	}

	_playDeathAnimation() {
		ig.game.events.callEvent(new ig.Event({
			steps: [{
				type: 'ADD_SLOW_MOTION',
				factor: 0.001,
				time: 0,
				name: 'playerRespawn'
			}, {
				type: 'SET_ZOOM_BLUR',
				zoomType: 'MEDIUM',
				fadeIn: 0.5,
				duration: 1,
				fadeOut: 1
			}, {
				type: 'SET_CAMERA_TARGET',
				entity: ig.game.playerEntity,
				speed: 0.1,
				transition: 'EASE_OUT',
				zoom: 1
			},
			{
				type: 'WAIT',
				time: 0.3,
				ignoreSlowDown: true
			}, {
				type: 'CLEAR_SLOW_MOTION',
				name: 'playerRespawn',
				time: 0.4
			}, {
				type: 'ADD_SLOW_MOTION',
				factor: 0.05,
				time: 0.8
			}, {
				type: 'SET_CAMERA_ZOOM',
				zoom: 3,
				duration: 2,
				transition: 'EASE_IN'
			}, {
				type: 'WAIT',
				time: 0.2,
				ignoreSlowDown: true
			}, {
				type: 'WAIT',
				time: 0.5,
				ignoreSlowDown: true
			}, {
				type: 'SET_OVERLAY_CORNER',
				alpha: 0,
				time: 0.5,
				color: 'RED'
			}, {
				type: 'SET_OVERLAY',
				alpha: 0.3,
				time: 0.5,
				color: 'white'
			}, {
				type: 'WAIT',
				time: 1,
				ignoreSlowDown: true
			}, {
				type: 'ADD_SLOW_MOTION',
				factor: 0,
				time: 0
			}, {
				type: 'WAIT',
				time: -1,
				ignoreSlowDown: true
			}]
		}), ig.EventRunType.BLOCKING);
	}

	/**
	 * 
	 * @param {any} slot
	 * @param {number} id 
	 */
	_containsGame(slot, id) {
		const data = slot.data;

		return data.vars 
		&& data.vars.storage 
		&& data.vars.storage.mods 
		&& data.vars.storage.mods.newgamepp 
		&& data.vars.storage.mods.newgamepp.id == id;
	}
}