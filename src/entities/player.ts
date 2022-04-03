import { Entity, Sprite, UpdateParams } from '../types';

const SPEED = 32;
export function createPlayer(sprite: Sprite): Player {
	const data = {
		state: 'idle',
	}
	const movement = new Phaser.Math.Vector2();
	sprite.body.setSize(16, 16);
	
	const update = (updateParams: UpdateParams) => {
		const cursors = updateParams.cursors;
		
		if (!cursors) {
			return ;
		}
		
		if (cursors.left.isDown) {
			movement.x = -SPEED;
		} else if (cursors.right.isDown) {
			movement.x = SPEED;
		} else {
			movement.x = 0;
		}

		if (cursors.up.isDown) {
			movement.y = -SPEED;
		}
		else if (cursors.down.isDown) {
			movement.y = SPEED;
		} else {
			movement.y = 0;
		}
		
		sprite.setVelocity(movement.x, movement.y);
		sprite.body.velocity.normalize().scale(SPEED);
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

	return {
		update
	};
}

export type Player = {

} & Entity
