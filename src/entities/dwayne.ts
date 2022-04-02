import { Entity, Sprite, UpdateParams } from '../types';

const styleToName = (style: DwayneAnimationStyle): string => {
	switch(style) {
	case 'forward': return 'dwayne-forward';
	case 'left': return 'dwayne-fLeft';
	case 'back-left': return 'dwayne-bLeft';
	case 'right': return 'dwayne-fRight';
	case 'back-right': return 'dwayne-bRight';
	}
}

export function createDwayne(fields: DwayneField[]): Dwayne {
	const data = {
		state: 'forward',
	}
	fields.forEach(({ sprite }) => sprite.body.setSize(16, 16));
	;
	const update = (updateParams: UpdateParams) => {
		fields.forEach(({ sprite, animationStyle }) => sprite.play({ key: styleToName(animationStyle), repeat: -1 }, true));
		;
	};
	return {
		update
	}
}

export type Dwayne = {

} & Entity

type DwayneAnimationStyle = 'forward' | 'left' | 'right' | 'back-left' | 'back-right';

export type DwayneField = { 
	sprite: Sprite;
	animationStyle: DwayneAnimationStyle;
	direction: 'up' | 'down' | 'left' | 'right';
}