import playerImage from './assets/player.png';
import playerData from './assets/player.json';

export const ASSET_KEYS = {
	PLAYER: 'player',
}

export function assetLoader(context: Phaser.Scene) {
	context.load.aseprite(ASSET_KEYS.PLAYER, playerImage, playerData);
}

const generateMap = () => {

};
