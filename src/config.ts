import Phaser from 'phaser';
import Game from './scenes/Game';

const config: Phaser.Types.Core.GameConfig =  {
	type: Phaser.AUTO,
	parent: 'game',
	backgroundColor: '#000',
	scale: {
		width: 256,
		height: 224,
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	render: {
		pixelArt: true,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
		}
	},
	scene: [Game]
};

export { config };
