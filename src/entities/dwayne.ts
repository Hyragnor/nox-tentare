import { Entity, Sprite, UpdateParams } from '../types';

export function createDwayne(sprite: Sprite): Dwayne {
	const data = {
		state: 'forward',
	}
	sprite.body.setSize(16, 16);
	const update = (updateParams: UpdateParams) => {
		sprite.play({ key: 'dwayne-forward', repeat: -1 }, true);
	};
	return {
		update
	}
}

export type Dwayne = {

} & Entity
