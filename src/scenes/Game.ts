import type { AvailableEventPayload, AvailableEvents, Entity, GameScene, Vector } from '../types';

import Phaser from 'phaser';

import { createPlayer, Player } from '../entities/player';

import { assetLoader, ASSET_KEYS } from '../assetLoader';

import { createSounds, playNextSong } from '../utils/sound';
import { createRoom, Room } from '../utils/room';

export default class Demo extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	entities = new Set<Entity>();
	player?: Player;
	stringMap?: string[][];
	rooms = new Map<string, Room>();
	sprites = new Set<Phaser.Physics.Arcade.Sprite>();
	
	preload() {
		assetLoader(this);
	}

	callEvent(event: AvailableEvents, argument: AvailableEventPayload) {
		if (event === 'kill-player') {
			if (!this.player) { return; }
			console.log(this.player);
			this.player.kill();
		}
	}

	registerSprite(sprite: Phaser.Physics.Arcade.Sprite) {
		this.sprites.add(sprite);
	}

	registerEntity(entity: Entity) {
		this.entities.add(entity);
	}

	getGameScene(): GameScene {
		const callEvent = (event: AvailableEvents, argument: AvailableEventPayload) => {
			if (event === 'kill-player') {
				if (!this.player) { return; }
				this.player.kill();
			}
		}

		return {
			context: this,
			callEvent,
			registerEntity: this.registerEntity,
			registerSprite: this.registerSprite,
			update: () => null,
		}
	}

	create() {
		this.scene.setVisible(false, 'gameScene');

		
		this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
		this.anims.createFromAseprite(ASSET_KEYS.DWAYNE);
		this.player = createPlayer(this.physics.add.sprite(48, 48, ASSET_KEYS.PLAYER));
		this.entities.add(this.player);
		
		this.cameras.main.startFollow(this.player.getSprite());
		
		const room = createRoom(this.getGameScene(), ASSET_KEYS.ROOM_RIGHT, this.player.getSprite(), 0, 0, this.rooms);
		this.rooms.set('0 0', room);
		room.triggerRoom({ x: 0, y: 7 });
		this.rooms.set('256 0', createRoom(this.getGameScene(), ASSET_KEYS.ROOM_RIGHT, this.player.getSprite(), 256, 0, this.rooms));

		this.player.getSprite().depth = 100;

		createSounds(this);
		playNextSong();
	}


	createSpotLight(x: number, y: number, radius: number) {
		if (!this.stringMap) { return; }
		const intRad = Math.ceil(radius/32.);
		const intX = Math.ceil(x/32.); 
		const intY = Math.ceil(y/32.); 
		const indexes: { x: number, y: number}[] = [];
		for (let iY = Math.min( intY-intRad, 0); iY < Math.min(intY + intRad, this.stringMap.length); iY++) {
			if (! this.stringMap[iY] ) { continue; }
			for (let iX = Math.min( intX-intRad, 0); iX < Math.min(intX + intRad, this.stringMap[iY].length); iX++) {
				if (this.stringMap[iY][iX] === 'w') indexes.push({ x: iX, y: iY });
			}
		}

		const shape = this.make.graphics({}, false);
		shape.beginPath();
		shape.fillStyle(0xffffff);

		shape.fillCircle(x, y, 100);
		
		shape.fillPath();
		return shape.createGeometryMask();
	}

	deleteMeWhenSongChangeIsImplementedCorrectly: number = 0;
	update(time: number, delta: number) {
		const cursors = this.input.keyboard.createCursorKeys();

		
		if (!this.player?.isDead()) {
			this.entities.forEach((entity) => entity.update({ cursors, delta }));
			this.rooms.forEach((room) => {room.update({ cursors, delta })});
		}

		// changes the song roughly every 4:18min, should be removed
		this.deleteMeWhenSongChangeIsImplementedCorrectly += delta;
		if (this.deleteMeWhenSongChangeIsImplementedCorrectly >= 260000) {
			playNextSong();
			this.deleteMeWhenSongChangeIsImplementedCorrectly -= 260000;
		}

		const pSprite = this.player?.getSprite();
		if (pSprite) {
			const radius = 150;
			const x = this.cameras.main.centerX;
			const y = this.cameras.main.centerY ;
			const mask = this.createSpotLight(x, y, radius);
			if (mask) {
				this.cameras.main.setMask(mask);
			}
		}
	}
}
