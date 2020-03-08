/// <reference path="../../../ccloader/js/types/plugin.d.ts" />

import { UiManager } from './uiManager.js';
import { Jetpack } from './features/jetpack.js';
import { Invincible } from './features/invincible.js';
import { ChargedOnly } from './features/chargedOnly.js';
import { RangedOnly } from './features/rangedOnly.js';
import { NoShield } from './features/noShield.js';
import { NoDash } from './features/noDash.js';
import { Overdrive } from './features/overdrive.js';
import { Unbalanced } from './features/unbalanced.js';
import { Clone } from './features/clone.js';
import { NoDeath } from './features/noDeath.js';
import { NoGui } from './features/noGui.js';

/**
 * @extends {ccloader.Plugin}
 */
export default class NewGamePlusPlus extends Plugin {
	constructor() {
		super();
        
		this.uiManager = new UiManager();
		
		this.features = [
			new Jetpack(),
			new Invincible(),
			new ChargedOnly(),
			new RangedOnly(),
			new NoShield(),
			new NoDash(),
			new Overdrive(), // Must be after RangedOnly
			new Unbalanced(),
			new Clone(),
			new NoDeath(),
			new NoGui(),
		];
    
		window.newGamePlusPlus = this;
	}
    
	prestart() {
		this._fixSave();
		this._callFeatures('prestart');
	}

	main() {
		const cat = this.uiManager.addCategory('mods', 'Mods', 'MULTI');
		cat.addEntry('jetpack', 'Jetpack', 'A jetpack that can be used with CTRL.', 2000);
		cat.addEntry('invincible', 'Invincible', 'Attacks received do no damage at all.', 5000);
		cat.addEntry('overdrive', 'Overdrive', 'All actions are combat arts.', 2000);
		cat.addEntry('clone', 'Perfect Clone', 'Play as Shizuka.', 2000);
		cat.addEntry('overload-extreme', 'Truly Unbalanced', 'Elements will overload after a single shot.', 100);
		cat.addEntry('charged-only', 'Charged Only', 'It is imposible to shoot uncharged balls.', 100);
		cat.addEntry('ranged-only', 'No Melee', 'Close quarter combat is not possible.', 100);
		cat.addEntry('no-shield', 'No Shield', 'The shield is disabled.', 100);
		cat.addEntry('no-dash', 'No Dash', 'Lea is unable to dash. Cheating is not allowed.', 100);
		cat.addEntry('no-death', 'No Death', 'People die if you kill them.', 100);
		cat.addEntry('no-gui', 'No GUI', 'Like nature intended it to be.', 100);
		

		this._callFeatures('main');
	}
    
	/**
     * @param {string} name The name of the function to call on all features
     */
	_callFeatures(name) {
		for (const feature of this.features) {
			if (typeof feature[name] === 'function') {
				feature[name]();
			}
		}
	}
    
	_fixSave() {
		sc.NewGamePlusModel.inject({
			onStorageSave(storage) {
				this.store.options = this.options; // this.store gets saved and loaded 1:1 but is barely used. Perfect for storing the modded options.
				this.parent(storage);
			},
			onStoragePreLoad(json) {
				// There is no way to know if modded options were removed so always restore them if available
				if (json.newGamePlus && json.newGamePlus.options && json.newGamePlus.store.options) {
					json.newGamePlus.options = json.newGamePlus.store.options;
				}
				this.parent(json);
			},
		});
	}
}
