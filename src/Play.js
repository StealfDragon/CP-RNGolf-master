class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X_MIN = 700
        this.SHOT_VELOCITY_X_MAX = 1700
        this.SHOT_VELOCITY_X = 500
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1700
        this.score = parseFloat(0)
        this.shots = parseFloat(0)

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        this.scoreText = this.add.text(0, 0, 'Score: 0').setDepth(1)
        this.shotsText = this.add.text(width / 2 - 175, 0, 'Shots: 0').setDepth(1)
        this.successText = this.add.text(width - 350, 0, 'Successful Shot Percentage: 0').setDepth(1)

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        this.physics.world.setBounds(0, 0, width, height)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height/10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(this.oneWay.width / 2)
        //this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        this.tweens.add({
            targets: this.oneWay,
            x: width - this.oneWay.width / 2,
            duration: 2250,
            yoyo: true,
            repeat: -1
        });

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            this.shots++
            this.shotsText.setText('Shots: ' + this.shots)
            this.successText.setText('Successful Shot Percentage: ' + (this.score / this.shots) * 100.0)
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1 //this is an if/else statement
            let shotDirectionX = Math.abs(pointer.x - this.ball.x) < 2 ? 0 : (pointer.x < this.ball.x ? 1 : -1);
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, 
                                                            this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
            if ((shotDirectionX != 0)) {
                this.ball.body.setVelocityX(this.SHOT_VELOCITY_X * shotDirectionX)
            }
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            //ball.destroy()
            this.ball.body.setVelocityX(0)
            this.ball.body.setVelocityY(0)
            ball.x = width/2
            ball.y = height - height/10
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
            this.successText.setText('Successful Shot Percentage: ' + (this.score / this.shots) * 100.0)
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

    }

    update() {

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[1] Add ball reset logic on successful shot
[1] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[1] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/