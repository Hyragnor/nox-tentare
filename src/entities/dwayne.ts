import { ASSET_KEYS } from '../assetLoader';
import { Entity, Sprite, UpdateParams } from '../types';

const styleToName = (style: DwayneAnimationStyle): string => {
	switch(style) {
	case 'forward': return 'dwayne-forward';
	case 'left': return 'dwayne-fLeft';
	case 'back-left': return 'dwayne-bLeft';
	case 'right': return 'dwayne-fRight';
	case 'back-right': return 'dwayne-bRight';
	case 'idle': return 'idle';
	}
}

const TILESIZE = 32;

const createDummyArray = () => {
	return [
		['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','f','f','f','f','f','f','f','f','f','f','f','f','f','f','w', ],
		['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w', ],
	];
};

export function createDwayne(
	context: Phaser.Scene,
	{ map, x, y, xOffs, yOffs }: { map: string[][], x: number, y: number, xOffs: number, yOffs: number } = {
		x: 0, y: 5, map: createDummyArray(), xOffs: 0, yOffs: 0
	}): Dwayne
{
	map[x][y] = 'd';
	const fields: DwayneField[] = [];

	const startNeighbors = () => {
		map[x][y] = 'd';
		const points = [ -1, 0, 1 ];
		points.forEach(dx => {
			points.forEach(dy => {
				if (!map[x+dx]) { return; }
				const next = map[x+dx][y+dy];
				if (!next || next != 'f') { return; }

				createDwayne(context, { map, x: x+dx, y: y+dy, xOffs, yOffs });
			})
		});
	};

	const sprite = context.physics.add.sprite(x * TILESIZE + xOffs, y * TILESIZE + yOffs, ASSET_KEYS.DWAYNE);
	sprite.body.setSize(TILESIZE/2, TILESIZE/2);
	const startField: DwayneField = {
		animationStyle: 'forward',
		direction: 'right',
		sprite: sprite,
		active: true,
	};
	fields.push(startField);
	sprite.play({ key: styleToName(startField.animationStyle), repeat: 0 }, true);
	sprite.on('animationcomplete', startNeighbors)

	const update = (updateParams: UpdateParams) => {

	};
	return {
		update
	}
}

export type Dwayne = {

} & Entity

type DwayneAnimationStyle = 'idle' | 'forward' | 'left' | 'right' | 'back-left' | 'back-right';

export type DwayneField = { 
	sprite: Sprite;
	animationStyle: DwayneAnimationStyle;
	direction: 'up' | 'down' | 'left' | 'right';
	active: boolean;
}