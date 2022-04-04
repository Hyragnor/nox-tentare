import { Entity, Sprite } from '../types';

const createDoor = (sprite: Sprite): Door => {
	const door = {
		open: false, 
	}

	const toggle = () => {
		door.open = !door.open;
		if (door.open) { sprite.anims.play('open', true); } 
		else { sprite.anims.reverse(); }
		return door.open;
	}

	return {
		update: () => null,
		toggle,
		getState: () => door.open,
	}
}

export type Door = {
	toggle: () => boolean,
	getState: () => boolean,
} & Entity

export { createDoor }
