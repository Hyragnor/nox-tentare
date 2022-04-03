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

const indices2keys = (x: number, y: number) => `${x} ${y}`;

export function createDwayne(
	context: Phaser.Scene,
	{ map, x, y, xOffs, yOffs }: { map: string[][], x: number, y: number, xOffs: number, yOffs: number } = {
		x: 0, y: 5, map: createDummyArray(), xOffs: 0, yOffs: 0
	},
	animationStyle: DwayneAnimationStyle = 'idle',
	direction: Direction = 'right',
): Dwayne {
	const fields: DwayneField[] = [];


	const direction2Angle = (direction: Direction): number => {
		switch(direction) {
			case 'down': { return 90; }
			case 'left': { return 180; }
			case 'up': { return -90; }
			default: { return 0; }
		}
	}

	const findAnimation = (x: number, y:number): DwayneAnimationStyle => {
		const points = [ -1, 0, 1 ];
		let counter = 0;
		points.forEach(dx => {
			points.forEach(dy => {
				if (dx === 0 && dy === 0) { return; }
				if (!map[x+dx]) { return; }
				const next = map[x+dx][y+dy];
				if (next === 'd' || next === 'd!') {
					counter ++;
				}
			});
		});
		if (counter === 1) {
			if (map[x - 1] && map[x - 1][y - 1].startsWith('d')) { return 'right'; }
			if (map[x - 1] && map[x - 1][y + 1].startsWith('d')) { return 'left'; }
			if (map[x + 1] && map[x + 1][y + 1].startsWith('d')) { return 'back-right'; }
			if (map[x + 1] && map[x + 1][y - 1].startsWith('d')) { return 'back-left'; }
		}
		return 'forward';
	}

	const findDirection = (x: number, y:number): Direction => {
		if (map[0][y + 1].startsWith('d')) { return 'up'; }
		if (map[x + 1] && map[x + 1][0].startsWith('d')) { return 'left'; }
		if (map[0][y - 1].startsWith('d')) { return 'down'; }
		return 'right';
	}

	const startNeighbors = () => {
		const nextPieces: {x: number, y:number, dx: number, dy: number, animationStyle: DwayneAnimationStyle, direction: Direction }[] = [];
		map[x][y] = 'd!';
		const points = [ -1, 0, 1 ];
		points.forEach(dx => {
			points.forEach(dy => {
				if (!map[x+dx]) { return; }
				const next = map[x+dx][y+dy];
				if (!next || next != 'f' ) { return; }
				const animation = findAnimation(x + dx, y + dy);
				const direction = animation === 'forward' ? findDirection(x + dx, y + dy): 'right';
				nextPieces.push({ x, y, dx, dy, animationStyle: animation, direction });
			})
		});
		nextPieces.forEach(({ x, y, dx, dy, animationStyle, direction }) => { 
			map[x+dx][y+dy] = 'd';
			createDwayne(context, { map, x: x+dx, y: y+dy, xOffs, yOffs }, animationStyle, direction );
		});
	};

	const sprite = context.physics.add.sprite(x * TILESIZE + xOffs, y * TILESIZE + yOffs, ASSET_KEYS.DWAYNE);
	sprite.body.setSize(TILESIZE/2, TILESIZE/2);
	sprite.angle = direction2Angle(direction);
	console.log(direction, sprite.angle)
	const startField: DwayneField = {
		animationStyle,
		direction,
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

type Direction = 'up' | 'down' | 'left' | 'right';

export type DwayneField = { 
	sprite: Sprite;
	animationStyle: DwayneAnimationStyle;
	direction: Direction;
	active: boolean;
}