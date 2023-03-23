import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import TestScene from './TestScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 530,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: true
		},
	},
	scene: [HelloWorldScene, TestScene],
}

export default new Phaser.Game(config)
