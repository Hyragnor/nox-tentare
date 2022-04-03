import { ASSET_KEYS } from '../assetLoader';
import { Entity, Sprite, UpdateParams } from '../types';

const styleToName = (style: DwayneAnimationStyle): string => {
	switch(style) {
	case 'forward': return 'dwayne-forward';
	case 'left': return 'dwayne-fLeft';
	case 'back-left': return 'dwayne-bLeft';
	case 'right': return 'dwayne-fRight';
	case 'back-right': return 'dwayne-bRight';
	case 'idle': return 'dwayne-idle';
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

export const dwayneSprites: Phaser.Physics.Arcade.Sprite[] = [];

export function createDwayne(
	context: Phaser.Scene,
	{ map, x, y, xOffs, yOffs }: { map: string[][], x: number, y: number, xOffs: number, yOffs: number } = {
		x: 0, y: 5, map: createDummyArray(), xOffs: 0, yOffs: 0
	},
	animationStyle: DwayneAnimationStyle = 'idle',
	direction: Direction = 'right',
): Dwayne {

	const direction2Angle = (direction: Direction): number => {
		switch(direction) {
			case 'down': { return 90; }
			case 'left': { return 180; }
			case 'up': { return -90; }
			default: { return 0; }
		}
	}

	const isActive = (x: number, y: number) => {
		return map[y] && map[y][x] === 'd!' || map[y][x] === 'd~';
	}

	const findAnimation = (x: number, y:number): DwayneAnimationStyle => {
		const points = [ -1, 0, 1 ];
		let counter = 0;
		points.forEach(dy => {
			if (!map[y+dy]) { return; }
			points.forEach(dx => {
				if (dx === 0 && dy === 0) { return; }
				const next = map[y+dy][x+dx];
				if (next === 'd~' || next === 'd!') {
					counter ++;
				}
			});
		});
		if (counter === 1) {
			if (isActive(x - 1, y - 1)) { return 'right'; }
			if (isActive(x + 1, y - 1)) { return 'back-left'; }
			if (isActive(x + 1, y + 1)) { return 'back-right'; }
			if (isActive(x - 1, y + 1)) { return 'left'; }
		}
		return 'forward';
	}

	const findDirection = (x: number, y:number): Direction => {
		if (isActive(x + 1, y)) { return 'left'; }
		if (isActive(x - 1, y)) { return 'right'; }
		if (isActive(x, y - 1)) { return 'down'; }
		if (isActive(x, y + 1)) { return 'up'; }
		return 'right';
	}

	const startNextWave = (x: number, y:number) => {
		const nextPieces: {x: number, y:number, dx: number, dy: number }[] = [];
		const points = [ -1, 0, 1 ];
		points.forEach(dy => {
			if (!map[y+dy]) { return; }
			points.forEach(dx => {
				const next = map[y+dy][x+dx];
				if (!next || next != 'f' ) { return; }
				const animation = findAnimation(x + dx, y + dy);
				const direction = animation === 'forward' ? findDirection(x + dx, y + dy): 'right';
				nextPieces.push({ x, y, dx, dy });
				createDwayne(context, { map, x: x+dx, y: y+dy, xOffs, yOffs }, animation, direction );
			})
		});
		nextPieces.forEach(({ x, y, dx, dy}) => { 
			map[y+dy][x+dx] = 'd?';
		});
	};

	const startNeighbors = () => {
		map[y][x] = 'd~';
		const done = !map.flat().find(element => element === 'd?');
		if (!done) { return; }
		for(let y = 0; y < map.length; y++) {
			for(let x = 0; x < map[y].length; x++) {
				if (map[y][x] === 'd~') {
					startNextWave(x, y);
				}
			}
		}
		for(let y = 0; y < map.length; y++) {
			for(let x = 0; x < map[y].length; x++) {
				if (map[y][x] === 'd~') {
					map[y][x] = 'd!'
				}
			}
		}
	};

	const sprite = context.physics.add.sprite(x * TILESIZE + xOffs, y * TILESIZE + yOffs, ASSET_KEYS.DWAYNE);
	sprite.body.setSize(TILESIZE/2, TILESIZE/2);
	sprite.angle = animationStyle === 'forward'? direction2Angle(direction): 0;
	const startField: DwayneField = {
		animationStyle,
		direction,
		sprite: sprite,
	};
	dwayneSprites.push(sprite);
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

type Direction = 'up' | 'down' | 'left' | 'right';

export type DwayneField = { 
	sprite: Sprite;
	animationStyle: DwayneAnimationStyle;
	direction: Direction;
}