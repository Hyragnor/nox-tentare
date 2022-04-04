import type { Entity, Vector } from '../types';

import Phaser from 'phaser';

import { createPlayer, Player } from '../entities/player';
import { createDwayne, Dwayne, dwayneSprites } from '../entities/dwayne';

import { assetLoader, ASSET_KEYS } from '../assetLoader';
import { map2StringArray } from '../utils/mapTransformer';

import { createSounds, playNextSong } from '../utils/sound';
import { createRoom, Room } from '../utils/room';

export default class Demo extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	entities = new Set<Entity>();
	player?: Player;
	dwayne?: Dwayne;
	stringMap?: string[][];
	rooms = new Map<string, Room>();
	
	preload() {
		assetLoader(this);
	}

	create() {
		this.scene.setVisible(false, 'gameScene');
		
		// const map = this.make.tilemap({ key: ASSET_KEYS.MAP });
		
		this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
		this.anims.createFromAseprite(ASSET_KEYS.DWAYNE);
		this.player = createPlayer(this.physics.add.sprite(48, 48, ASSET_KEYS.PLAYER));
		this.entities.add(this.player);
		// this.physics.world.addCollider(this.player.getSprite(), room.floorLayer);
		
		this.cameras.main.startFollow(this.player.getSprite());
		
		const room = createRoom(this, ASSET_KEYS.ROOM_RIGHT, this.player.getSprite(), 0, 0, this.rooms);
		this.rooms.set('0 0', room);
		this.rooms.set('256 0', createRoom(this, ASSET_KEYS.ROOM_RIGHT, this.player.getSprite(), 256, 0, this.rooms));
		this.stringMap = room.fields;
		this.dwayne = createDwayne(this, { map: room.fields, x: 0, y: 6, xOffs: 16, yOffs: 16 }, undefined, undefined, room.triggerRoom);
		this.entities.add(this.dwayne);

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
		if(this.dwayne && dwayneSprites){
			for(const sprite of dwayneSprites){
				if(this.player && this.physics.collide(this.player.getSprite(), sprite)){
					this.player.kill();
				}
			}
		}
		this.entities.forEach((entity) => entity.update({ cursors, delta }));

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
