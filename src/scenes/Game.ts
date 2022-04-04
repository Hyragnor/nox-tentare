import type { Entity } from '../types';

import Phaser from 'phaser';

import { createPlayer, Player } from '../entities/player';
import { createDwayne, Dwayne, dwayneSprites } from '../entities/dwayne';

import { assetLoader, ASSET_KEYS } from '../assetLoader';
import { map2StringArray } from '../utils/mapTransformer';

import { createSounds, playNextSong } from '../utils/sound';
import { createRoom } from '../utils/room';

export default class Demo extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	entities = new Set<Entity>();
	player?: Player;
	dwayne?: Dwayne;
	
	preload() {
		assetLoader(this);
	}

	create() {
		const room = createRoom(this, ASSET_KEYS.ROOM_1);
		this.scene.setVisible(false, 'gameScene');
		
		const map = this.make.tilemap({ key: ASSET_KEYS.MAP });

		this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
		this.player = createPlayer(this.physics.add.sprite(48, 48, ASSET_KEYS.PLAYER));
		this.entities.add(this.player);
		this.physics.world.addCollider(this.player.getSprite(), room.floorLayer);

		this.anims.createFromAseprite(ASSET_KEYS.DWAYNE);
		this.dwayne = createDwayne(this, { map: room.fields, x: 0, y: 6, xOffs: 16, yOffs: 16 });
		this.entities.add(this.dwayne);

		createSounds(this);
		playNextSong();
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
		this.entities.forEach((entity) => entity.update({ cursors }));

		// changes the song roughly every 4:18min, should be removed
		this.deleteMeWhenSongChangeIsImplementedCorrectly += delta;
		if (this.deleteMeWhenSongChangeIsImplementedCorrectly >= 260000) {
			playNextSong();
			this.deleteMeWhenSongChangeIsImplementedCorrectly -= 260000;
		}


		const shape = this.make.graphics({}, false);

		const pSprite = this.player?.getSprite();
		if (pSprite) {
			shape.beginPath();
			shape.fillCircle(pSprite.body.center.x, pSprite.body.center.y, 200)
	
			const mask = shape.createGeometryMask();
	
			this.cameras.main.setMask(mask);
		}
	}
}
