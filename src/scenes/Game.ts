import Phaser from 'phaser';
import { createPlayer, Player } from '../entities/player';
import { Entity } from '../types';
import { assetLoader, ASSET_KEYS } from '../assetLoader';

export default class Demo extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	entities = new Set<Entity>();
	player: Player| undefined;

	preload() {
		assetLoader(this);
	}

	create() {
		this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
		this.player = createPlayer(this.physics.add.sprite(48, 48, ASSET_KEYS.PLAYER));
		this.entities.add(this.player);
	}

	update() {
		this.entities.forEach((entity) => entity.update({}));
	}
}
