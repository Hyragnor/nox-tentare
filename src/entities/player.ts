import { Entity, Sprite, UpdateParams } from '../types';

const SPEED_FACTOR = 8;
export function createPlayer(sprite: Sprite): Player {
	const data = {
		state: 'idle',
	}
	const movement = new Phaser.Math.Vector2();
	sprite.body.setSize(16, 16);
	
	const update = (updateParams: UpdateParams) => {
		const { cursors, delta } = updateParams;

		const speed = SPEED_FACTOR * delta;

		if (!cursors) {
			return ;
		}
		
		if (cursors.left.isDown) {
			movement.x = -speed;
		} else if (cursors.right.isDown) {
			movement.x = speed;
		} else {
			movement.x = 0;
		}

		if (cursors.up.isDown) {
			movement.y = -speed;
		}
		else if (cursors.down.isDown) {
			movement.y = speed;
		} else {
			movement.y = 0;
		}
		
		sprite.setVelocity(movement.x, movement.y);
		sprite.body.velocity.normalize().scale(speed);
		sprite.play({ key: getAnimKey(movement), repeat: -1 }, true);
	};
	
	const getAnimKey = (movement: Phaser.Math.Vector2): string => {
		if (movement.x === 0 && movement.y === 0) {
			return 'idle';
		}

		if (movement.y < 0) {
			return 'move-up';
		}

		if (movement.y > 0) {
			return 'move-down';
		}

		if (movement.x < 0) {
			return 'move-left';
		}

		return 'move-right';
	};
	let dead = false;
	const kill = () => dead = true;
	const isDead = () => dead;

	const getSprite = () => sprite;
	return {
		getSprite,
		isDead,
		kill,
		update
	};
}

export type Player = {
	getSprite: () => Sprite;
	isDead: () => boolean;
	kill: () => void;
} & Entity
