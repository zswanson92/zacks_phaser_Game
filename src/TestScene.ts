import Phaser from 'phaser'

export default class TestScene extends Phaser.Scene {

	private platforms?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
	private coin?: Phaser.Physics.Arcade.Group

	private score = 0
	private scoreText?: Phaser.GameObjects.Text

	private bombs?: Phaser.Physics.Arcade.Group
	private fireball?: Phaser.Physics.Arcade.Group

	private gameOver = false

	constructor() {
		super('TestScene')
	}

	preload() {
		this.load.image('sky', 'assets/sky.png')
		this.load.image('ground', 'assets/platform.png')
		this.load.image('star', 'assets/star.png')
		this.load.image('bomb', 'assets/bomb.png')
		this.load.image('coin', 'assets/coin.png')
		this.load.image('fireball', 'assets/fireball.png')
		this.load.spritesheet('mario', 'assets/roundtwosprites.png',{
			frameWidth: 26, frameHeight: 37.7
		})
		this.load.spritesheet('dude', 'assets/dude.png',
		{ frameWidth: 32, frameHeight: 48 }
		)
	}

	create() {
		this.add.image(400, 300, 'sky')
		// this.add.image(400, 300, 'star')

		this.platforms = this.physics.add.staticGroup()
		const ground = this.platforms.create(400, 500, 'ground') as Phaser.Physics.Arcade.Sprite

		ground
			.setScale(2)
			.refreshBody()

		this.platforms.create(600, 400, 'ground')
		this.platforms.create(50, 250, 'ground')
		this.platforms.create(750, 220, 'ground')

		this.player = this.physics.add.sprite(300, 250, 'mario')
		this.player.setBounce(0.2)
		this.player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('mario', {
				start: 3,
				end: 6
			}),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'turn',
			frames: [{key: 'mario', frame: 8}],
			frameRate: 20
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('mario', {
				start: 9, end: 12
			}),
			frameRate: 10,
			repeat: -1
		})


		this.physics.add.collider(this.player, this.platforms)

		this.cursors = this.input.keyboard.createCursorKeys()

		this.coin = this.physics.add.group({
			key: 'coin',
			repeat: 11,
			setXY: {x: 12, y: 0, stepX: 70}
		})



		this.coin.children.iterate(child => {
			const c = child as Phaser.Physics.Arcade.Image
			c.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4))
			c.setScale(0.5)
		})

		this.physics.add.collider(this.coin, this.platforms)

		this.physics.add.overlap(this.player, this.coin, this.handleCollectStar, undefined, this )

		this.scoreText = this.add.text(16, 16, 'score: 0', {
			fontSize: '32px',
		})

		this.bombs = this.physics.add.group()
		this.fireball = this.physics.add.group()

		this.physics.add.collider(this.bombs, this.platforms)
		this.physics.add.collider(this.fireball, this.platforms)
		this.physics.add.collider(this.player, this.bombs, this.handleHitBomb, undefined, this)
		this.physics.add.collider(this.player, this.fireball, this.handleFireball, undefined, this)


	}

	private handleFireball(player: Phaser.GameObjects.GameObject, fireball: Phaser.GameObjects.GameObject){
		this.physics.pause()

		this.player?.setTint(0xff0000)
		this.player?.anims.play('turn')

		this.gameOver = true

		var result = confirm( "Do you want try again?" );

		if ( result ) {
    	this.score = 0

		this.scene.restart()
		} else {
			alert("fu")
		}
	}

	private handleHitBomb(player: Phaser.GameObjects.GameObject, bomb: Phaser.GameObjects.GameObject){
		this.physics.pause()

		this.player?.setTint(0xff0000)
		this.player?.anims.play('turn')

		this.gameOver = true

		var result = confirm( "Do you want try again?" );

		if ( result ) {
    	this.score = 0

		this.scene.restart()
		} else {
			alert("fu")
		}


	}

	private handleCollectStar(player: Phaser.GameObjects.GameObject, star: Phaser.GameObjects.GameObject)
	{
		const s = star as Phaser.Physics.Arcade.Image
		s.disableBody(true, true)

		this.score += 10
		this.scoreText.setText(`Score: ${this.score}`)

		if(this.coin?.countActive(true) === 0){
			this.coin.children.iterate(c => {
				const child = c as Phaser.Physics.Arcade.Image
				child.enableBody(true, child.x, 0, true, true)
			})

			if(this.player){
				const x = this.player.x < 400
				? Phaser.Math.Between(400, 800)
				: Phaser.Math.Between(0, 400)

				const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(x, 16, 'bomb')
				bomb.setBounce(1)
				bomb.setCollideWorldBounds(true)
				bomb.setVelocityY(Phaser.Math.Between(-200, 200))
				bomb.setVelocityX(Phaser.Math.Between(-200, 200))

				const fireball: Phaser.Physics.Arcade.Image = this.fireball?.create(0, 0, 'fireball')
				fireball.setBounce(1, 0)
				fireball.setCollideWorldBounds(true)
				fireball.setAngularVelocity(100)
				fireball.setY(436)
				fireball.setX(0)
				fireball.setVelocityX(100)
				fireball.setGravityY(1000)
				fireball.setScale(0.5, 0.5)
			}

            if(this.score === 240){
                alert("You win!!")
                this.scene.stop("TestScene")
            }

		}
	}

	update() {
		if(this.cursors?.left?.isDown){
			this.player?.setVelocityX(-160)
			this.player?.anims.play('left', true)
		}
		else if(this.cursors?.right?.isDown){
			this.player?.setVelocityX(160)
			this.player?.anims.play('right', true)
		}
		else{
			this.player?.setVelocityX(0)
			this.player?.anims.play('turn')
		}

		if(this.cursors.up?.isDown && this.player?.body.touching.down){
			this.player.setVelocityY(-330)
		}
	}
}
