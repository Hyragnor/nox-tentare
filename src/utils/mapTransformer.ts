import { ASSET_KEYS } from '../assetLoader';
import Phaser from 'phaser';

const map2StringArray = (map: Phaser.Tilemaps.Tilemap): string[][] => {
	const layer = map.getLayer(ASSET_KEYS.TILE_FLOOR);
	const collision = map.getLayer(ASSET_KEYS.TILE_INTERACTIVE_OBJECTS);
	console.log(collision)
	const arr = [];
	for (let x = 0; x < layer.width; x++) {
		const line = []
		for (let y = 0; y < layer.height; y++) {
			console.log(collision.data[y][x])
			line.push(collision.data[y][x].collides ? 'w': 'f');
		}
		arr.push(line);
	}
	console.log(arr)
	return arr;
};

export { map2StringArray };