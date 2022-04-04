import { ASSET_KEYS } from '../assetLoader';
import { createDoor, Door } from '../entities/door';
import type { Entity, Vector } from '../types';
import { map2StringArray } from './mapTransformer';

const createRoom = (context: Phaser.Scene, room: string) => {
	const map = context.make.tilemap({ key: room });
	const tileset = map.addTilesetImage(ASSET_KEYS.TILES_NAME, ASSET_KEYS.TILES);
	const floorLayer = map.createLayer(ASSET_KEYS.TILE_FLOOR, tileset);
	const items = map.createFromObjects('items', []);

	floorLayer.setCollisionByProperty({collidable: true});
	
	const fields = map2StringArray(map);

	const entities: RoomEntities = {
		moveable: new Map<string, Entity>(),
		door: undefined,
		input: undefined,
		output: undefined,
	};

	items.forEach((item, index) => {
		switch (item.name) {
			case 'door': {
				entities.door = createDoor(context.physics.add.sprite(48, 48, ASSET_KEYS.DOOR));
			}
			case 'box': {
				entities.moveable.set(`box-${index}`, { update: () => null });
			}
		}
	});
	return { map, floorLayer, entities, fields };
}

type RoomEntities = {
	moveable: Map<string, Entity>,
	door?: Door,
	input?: Vector,
	output?: Vector,
}

export { createRoom };
