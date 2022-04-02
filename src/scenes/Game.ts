import type { Entity } from '../types';

import Phaser from 'phaser';

import { createPlayer, Player } from '../entities/player';
import { createDwayne, Dwayne } from '../entities/dwayne';

import { assetLoader, ASSET_KEYS } from '../assetLoader';

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
		this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
		this.player = createPlayer(this.physics.add.sprite(48, 48, ASSET_KEYS.PLAYER));
		this.entities.add(this.player);

		this.anims.createFromAseprite(ASSET_KEYS.DWAYNE);
		this.dwayne = createDwayne(this.physics.add.sprite(12, 48, ASSET_KEYS.DWAYNE ));
		console.log(this.anims)
		this.entities.add(this.dwayne);
	}

	update() {
		this.entities.forEach((entity) => entity.update({}));
	}
}
