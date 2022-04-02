import playerImage from './assets/player.png';
import playerData from './assets/player.json';

import dwayneImage from './assets/dwayne.png';
import dwayneData from './assets/dwayne.json';

import map from './assets/room.json';

export const ASSET_KEYS = {
	PLAYER: 'player',
	DWAYNE: 'dwayne',

	MAP: 'map',
}

export function assetLoader(context: Phaser.Scene) {
	context.load.tilemapTiledJSON(ASSET_KEYS.MAP, map);

	context.load.aseprite(ASSET_KEYS.PLAYER, playerImage, playerData);
	context.load.aseprite(ASSET_KEYS.DWAYNE, dwayneImage, dwayneData);
}

export const generateMap = (context: Phaser.Scene) => {
	const map = context.make.tilemap({ key: ASSET_KEYS.MAP });
	
};
