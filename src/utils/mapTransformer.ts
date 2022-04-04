import { ASSET_KEYS } from '../assetLoader';
import Phaser from 'phaser';

const map2StringArray = (map: Phaser.Tilemaps.Tilemap): string[][] => {
	const floor = map.getLayer(ASSET_KEYS.TILE_FLOOR);
	const doors = map.getLayer(ASSET_KEYS.TILE_ITEM);
	console.log(doors);
	const arr = [];
	for (let y = 0; y < floor.height; y++) {
		const line = []
		for (let x = 0; x < floor.width; x++) {
			const tile = floor.data[y][x];
			if (doors.data[y][x].properties.key === 'd') {
				line.push('d');
			}
			else {
				line.push(tile.properties.key !== 'f' ? 'w': 'f');
			}
		}
		arr.push(line);
	}
	return arr;
};

export { map2StringArray };