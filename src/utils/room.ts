import { ASSET_KEYS } from '../assetLoader';
import { createDoor, Door } from '../entities/door';
import { createDwayne } from '../entities/dwayne';
import type { Entity, Sprite, Vector } from '../types';
import { map2StringArray } from './mapTransformer';

const createRoom = (
	context: Phaser.Scene,
	room: string,
	player: Sprite,
	offsetX = 0,
	offsetY = 0,
	rooms: Map<string, { fields: string[][], triggerRoom: (x: number, y: number) => void }>
) => {
	const map = context.make.tilemap({ key: room });
	const tileset = map.addTilesetImage(ASSET_KEYS.TILES_NAME, ASSET_KEYS.TILES);
	const floorLayer = map.createLayer(ASSET_KEYS.TILE_FLOOR, tileset, offsetX, offsetY);
	// const items = map.createLayer(ASSET_KEYS.TILE_ITEM, ASSET_KEYS.TILES);
	// 

	floorLayer.setCollisionByProperty({collidable: true});
	context.physics.add.collider(floorLayer, player);
	
	const fields = map2StringArray(map);

	const entities: RoomEntities = {
		moveable: new Map<string, Entity>(),
		door: undefined,
		input: undefined,
		output: undefined,
	};

	// items.forEach((item, index) => {
	// 	switch (item.name) {
	// 		case 'door': {
	// 			entities.door = createDoor(context.physics.add.sprite(48, 48, ASSET_KEYS.DOOR));
	// 		}
	// 		case 'box': {
	// 			entities.moveable.set(`box-${index}`, { update: () => null });
	// 		}
	// 	}
	// });

	const dwayneCoordStuff = (x: number, y: number): Vector => {
		if (x === 8) return { x: 0, y };
		if (y === 14) return { x, y: 0 };
		return { x, y: 14};
	}

	const roomCoordStuff = (x: number, y: number): Vector => {
		if (x === 7) return { x: offsetX + 8*32, y: offsetY }; // rechts
		if (y === 13) return { x: offsetX, y: offsetY + 14 * 32 }; // unten
		return { x: offsetX, y: offsetY - 14 * 32}; //oben
	}

	const triggerRoom = (x: number, y: number) => {
		console.log(roomCoordStuff(x, y));
		console.log(rooms);
		const coord = roomCoordStuff(x, y);
		console.log(`${coord.x} ${coord.y}`);
		const room = rooms.get(`${coord.x} ${coord.y}`);
		if (!room) { console.log('room is undefined'); return ; }
		const dwayneCoords = dwayneCoordStuff(x, y);
		createDwayne(context, { map: room.fields, x: dwayneCoords.x, y: dwayneCoords.y, xOffs: 16, yOffs: 16 }, undefined, undefined, room.triggerRoom);

		
	}

	return { map, floorLayer, entities, fields, triggerRoom };
}

type RoomEntities = {
	moveable: Map<string, Entity>,
	door?: Door,
	input?: Vector,
	output?: Vector,
}

export type Room = ReturnType<typeof createRoom>;

export { createRoom };
