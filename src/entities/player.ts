import { Entity, UpdateParams } from '../types';

export function Player(): Entity {
	const update = (updateParams: UpdateParams) => {
		console.log('update player');
	};
	return {
		update
	}
}
