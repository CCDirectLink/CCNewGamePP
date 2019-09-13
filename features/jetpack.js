export class Jetpack {
	constructor() {
        
	}
    
	main() {
		ig.input.bind(17, 'jump');
		ig.game.addons.preUpdate.push(this);
	}
    
	onPreUpdate() {
		if (sc.newgame.get('jetpack')
        && ig.input.state('jump')
        && ig.game.playerEntity) {
			ig.game.playerEntity.doJump(185, 16, 100);
		}
	}
}