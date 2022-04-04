import playerImage from './assets/player.png';
import playerData from './assets/player.json';

import dwayneImage from './assets/dwayne.png';
import dwayneData from './assets/dwayne.json';

import tiles from './assets/rooms/atlas.png';

import room_a from './assets/rooms/first-room.json';
import room_1 from './assets/rooms/left-down.json';

import song1 from './assets/music/nox tentare1.ogg';
import song2 from './assets/music/nox tentare2.ogg';
import song3 from './assets/music/nox tentare3.ogg';

export const ASSET_KEYS = {
	PLAYER: 'player',
	DWAYNE: 'dwayne',
	MAP: 'room_a',
	ROOM_1: 'room_1',
	TILES: 'tile-map',
	TILES_NAME: 'atlas', // equals the name of the tileset used in the map
	TILE_FLOOR: 'floor',
	TILE_INTERACTIVE_OBJECTS: 'interactive-objects',
	MUSIC_1: 'music_1',
	MUSIC_2: 'music_2',
	MUSIC_3: 'music_3',
	DOOR: 'door',
}

export function assetLoader(context: Phaser.Scene) {
	context.load.image(ASSET_KEYS.TILES, tiles);
	context.load.tilemapTiledJSON(ASSET_KEYS.MAP, room_a);
	context.load.tilemapTiledJSON(ASSET_KEYS.ROOM_1, room_1);

	context.load.aseprite(ASSET_KEYS.PLAYER, playerImage, playerData);
	context.load.aseprite(ASSET_KEYS.DWAYNE, dwayneImage, dwayneData);

	context.load.audio(ASSET_KEYS.MUSIC_1, song1);
	context.load.audio(ASSET_KEYS.MUSIC_2, song2);
	context.load.audio(ASSET_KEYS.MUSIC_3, song3);
}

export const generateMap = (context: Phaser.Scene) => {
	// const map = context.make.tilemap({ key: ASSET_KEYS.MAP });	
};
