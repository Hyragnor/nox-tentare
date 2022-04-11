import { ASSET_KEYS } from '../assetLoader';
import { createDoor, Door } from '../entities/door';
import { createDwayne } from '../entities/dwayne';
import type { Entity, Sprite, UpdateParams, Vector } from '../types';
import { map2StringArray } from './mapTransformer';

const createRoom = (
	context: Phaser.Scene,
	room: string,
	player: Sprite,
	offsetX = 0,
	offsetY = 0,
	rooms: Map<string, { fields: string[][], triggerRoom: (outgoingGridPos: Vector) => void }>
) => {
	const map = context.make.tilemap({ key: room });
	const tileset = map.addTilesetImage(ASSET_KEYS.TILES_NAME, ASSET_KEYS.TILES);
	const floorLayer = map.createLayer(ASSET_KEYS.TILE_FLOOR, tileset, offsetX, offsetY);

	floorLayer.setCollisionByProperty({collidable: true});
	context.physics.add.collider(floorLayer, player);
	
	const fields = map2StringArray(map);

	const entities: RoomEntities = {
		entities: new Set<Entity>(),
		sprites: [],
		isTriggered: false,
	};

	const transferPositionFromLastRoom = ({ x, y }: Vector): Vector => {
		if (x === 7) return { x: 0, y };
		if (y === 13) return { x, y: 0 };
		return { x, y: 13};
	}

	// identify the next room 
	const roomCoordStuff = ({ x, y }: Vector): Vector => {
		if (x === 7) return { x: offsetX + 8*32, y: offsetY }; // rechts
		if (y === 13) return { x: offsetX, y: offsetY + 14 * 32 }; // unten
		return { x: offsetX, y: offsetY - 14 * 32}; //oben
	}

	const update = (params: UpdateParams) => {
		entities.entities.forEach((entity) => { entity.update(params); });
	}

	const registerSprite = (sprite: Phaser.Physics.Arcade.Sprite) => {
		entities.sprites.push(sprite);
	};

	const triggerRoom = (entrancePos: Vector) => {
		const dwayne = createDwayne(
			context,
			{ map: fields, x: entrancePos.x, y: entrancePos.y, xOffs: 16+offsetX, yOffs: 16+offsetY },
			undefined,
			undefined,
			triggerNextRoom,
			registerSprite,
		);
		entities.entities.add(dwayne);
	}

	const triggerNextRoom = (outgoingGridPos: Vector) => {
		// get the next room by the grid pos of dwayne
		if (entities.isTriggered) {
			return ;
		}
		entities.isTriggered = true;
		const dwayneCoords = transferPositionFromLastRoom(outgoingGridPos);
		const coord = roomCoordStuff(outgoingGridPos);
		const room = rooms.get(`${coord.x} ${coord.y}`);
		console.log(`outgoing position ${outgoingGridPos.x}, ${outgoingGridPos.y}`);
		if (!room) { console.log(`room ${coord.x}, ${coord.y} is undefined`); return ; }
		console.log(room);
		room.triggerRoom(dwayneCoords);
	}

	return { map, floorLayer, entities, fields, triggerRoom, update };
}

type RoomEntities = {
	entities: Set<Entity>;
	isTriggered: boolean;
	sprites: Phaser.Physics.Arcade.Sprite[];
}

export type Room = ReturnType<typeof createRoom>;

export { createRoom };
