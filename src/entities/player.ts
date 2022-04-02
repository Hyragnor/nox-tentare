import { Entity, Sprite, UpdateParams } from '../types';

export function createPlayer(sprite: Sprite): Player {
	const data = {
		state: 'idle',
	}
	sprite.body.setSize(16, 16);
	const update = (updateParams: UpdateParams) => {
		sprite.play({ key: 'idle', repeat: -1 }, true);
	};
	return {
		update
	}
}

export type Player = {

} & Entity
