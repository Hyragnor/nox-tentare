import playerImage from './assets/player.png';
import playerData from './assets/player.json';

import dwayneImage from './assets/dwayne.png';
import dwayneData from './assets/dwayne.json';

export const ASSET_KEYS = {
	PLAYER: 'player',
	DWAYNE: 'dwayne',
}

export function assetLoader(context: Phaser.Scene) {
	context.load.aseprite(ASSET_KEYS.PLAYER, playerImage, playerData);
	context.load.aseprite(ASSET_KEYS.DWAYNE, dwayneImage, dwayneData);
}

const generateMap = () => {

};
