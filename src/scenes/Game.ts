import type { Entity } from '../types';

import Phaser from 'phaser';

import { createPlayer, Player } from '../entities/player';
import { createDwayne, Dwayne, dwayneSprites } from '../entities/dwayne';

import { assetLoader, ASSET_KEYS } from '../assetLoader';
import { map2StringArray } from '../utils/mapTransformer';

import { createSounds, playNextSong } from '../utils/sound';

export default class Demo extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	entities = new Set<Entity>();
	player: Player| undefined;
	dwayne?: Dwayne;
	
	preload() {
		assetLoader(this);
	}

	create() {
		this.scene.setVisible(false, 'gameScene');
		const map = this.make.tilemap({ key: ASSET_KEYS.MAP });
		const tileset = map.addTilesetImage(ASSET_KEYS.TILES_NAME, ASSET_KEYS.TILES);
		const floorLayer = map.createLayer(ASSET_KEYS.TILE_FLOOR, tileset);
		floorLayer.setCollisionByProperty({collidable: true});
		map.createLayer(ASSET_KEYS.TILE_INTERACTIVE_OBJECTS, tileset);
		const mapAsArray = map2StringArray(map);

		this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
		this.player = createPlayer(this.physics.add.sprite(48, 48, ASSET_KEYS.PLAYER));
		this.entities.add(this.player);
		this.physics.world.addCollider(this.player.getSprite(), floorLayer);

		this.anims.createFromAseprite(ASSET_KEYS.DWAYNE);
		this.dwayne = createDwayne(this, { map: mapAsArray, x: 0, y: 6, xOffs: 16, yOffs: 16});
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
	}
}
