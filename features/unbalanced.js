export class Unbalanced {
	prestart() {
		sc.PlayerModel.inject({
			/**
             * 
             * @param {number} amount
             */
			addElementLoad(amount) {
				if (sc.newgame.get('overload-extreme')
                && amount > 0) {
					amount *= 100;
				}
                
				this.parent(amount);
			}
		});
	}
}