import { ASSET_KEYS } from '../assetLoader';
import Phaser from 'phaser';

const map2StringArray = (map: Phaser.Tilemaps.Tilemap): string[][] => {
	const layer = map.getLayer(ASSET_KEYS.TILE_FLOOR);
	const arr = [];
	for (let y = 0; y < layer.height; y++) {
		const line = []
		for (let x = 0; x < layer.width; x++) {
			const tile = layer.data[y][x];
			line.push(tile.properties.key !== 'f' ? 'w': 'f');
		}
		arr.push(line);
	}
	return arr;
};

export { map2StringArray };