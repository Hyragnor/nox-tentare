import playerImage from './assets/player.png';
import playerData from './assets/player.json';

import dwayneImage from './assets/dwayne.png';
import dwayneData from './assets/dwayne.json';

import tiles from './assets/rooms/atlas.png';

import room_a from './assets/rooms/first-room.json';

export const ASSET_KEYS = {
	PLAYER: 'player',
	DWAYNE: 'dwayne',
	MAP: 'room_a',
	TILES: 'tile-map',
	TILES_NAME: 'atlas', // equals the name of the tileset used in the map
	TILE_FLOOR: 'floor',
	TILE_INTERACTIVE_OBJECTS: 'interactive-objects',
}

export function assetLoader(context: Phaser.Scene) {
	context.load.image(ASSET_KEYS.TILES, tiles);
	context.load.tilemapTiledJSON(ASSET_KEYS.MAP, room_a);

	context.load.aseprite(ASSET_KEYS.PLAYER, playerImage, playerData);
	context.load.aseprite(ASSET_KEYS.DWAYNE, dwayneImage, dwayneData);
}

export const generateMap = (context: Phaser.Scene) => {
	// const map = context.make.tilemap({ key: ASSET_KEYS.MAP });	
};
