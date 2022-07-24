import platFormImg from '../assets/platform.png'
import Background from '../assets/background.png'
import Hills from '../assets/hills.png'

import SpriteRunLeft from '../assets/spriteRunLeft.png'
import SpriteRunRight from '../assets/spriteRunRight.png'
import SpriteStandLeft from '../assets/spriteStandLeft.png'
import SpriteStandRight from '../assets/spriteStandRight.png'

const canvus = document.querySelector('canvas')
const C = canvus.getContext('2d')

canvus.width = innerWidth - 100
canvus.height = innerHeight - 100

let gravity = .5

class Player{
    constructor(){
        this.speed = 10
        this.position = {
            x: 100,
            y: 100,
        }
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.width = 66
        this.height = 150
        this.image = createImg(SpriteStandRight)
        this.frame = 0

        this.sprite = {
            stand: {
                right: createImg(SpriteStandRight),
                cropWidth: 177,
                width: 66,
                left: createImg(SpriteStandLeft),
            },
            run: {
                right: createImg(SpriteRunRight),
                width: 127.875,
                cropWidth: 341,
                left: createImg(SpriteRunLeft),
            }
        } 
        this.currentSprite = this.sprite.stand.right
        this.currentCropWidth = this.sprite.stand.cropWidth
    }

    draw() {
        C.drawImage(
            this.currentSprite,
            this.currentCropWidth*this.frame,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    update() {
        this.frame++;
        
        if (this.frame > 59 && (this.currentSprite === this.sprite.stand.right ||this.currentSprite === this.sprite.stand.left)) this.frame = 0
        else if(this.frame > 29 && (this.currentSprite === this.sprite.run.right ||this.currentSprite === this.sprite.run.left)) this.frame = 0
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.draw()

        if (this.position.y + this.height + this.velocity.y <= canvus.height) this.velocity.y += gravity
        // else this.velocity.y = 0;
    }
}

class PlatForm{
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = 580
        this.height = 125
    }

    draw() {
        C.drawImage(this.image, this.position.x, this.position.y)
    }
}


class GenericObject{
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.width
    }

    draw() {
        C.drawImage(this.image, this.position.x, this.position.y)
    }
}

let player = new Player()


function createImg(src) {
    const image = new Image()
    image.src = src
    return image;
}
let platFormImage = createImg(platFormImg)

let platforms = [
   
]


let genericObjects = [
   
]

let lastKey ;

let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrolloffSet = 0;

function init() {
    

    player = new Player()


    function createImg(src) {
        const image = new Image()
        image.src = src
        return image;
    }
    platFormImage = createImg(platFormImg)

    platforms = [
        new PlatForm({ x: -1, y: 500, image: platFormImage }),
        new PlatForm({ x: 575, y: 500, image: platFormImage }),
        new PlatForm({ x: 575 * 2 + 150, y: 500, image: platFormImage })
    ]


    genericObjects = [
        new GenericObject({ x: -1, y: -1, image: createImg(Background) }),
        new GenericObject({ x: -1, y: -1, image: createImg(Hills) }),
    
    ]

    scrolloffSet = 0;
}


function animate() {
    requestAnimationFrame(animate)
    C.fillStyle = 'white'
    C.fillRect(0, 0, canvus.width, canvus.height)
   
    genericObjects.forEach(genericObj => { 
        genericObj.draw()
    })

    platforms.forEach(platForm => { 
        platForm.draw()
    })
    player.update()
    if (keys.right.pressed && player.position.x  < 400) {
        player.velocity.x = player.speed

    } else if ((keys.left.pressed && player.position.x  > 100) || keys.left.pressed && scrolloffSet ===0 && player.position.x > 0) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0;
        
        if (keys.right.pressed) {
            scrolloffSet += 5;
            platforms.forEach(platForm => {
                platForm.position.x -= player.speed
            })
            genericObjects.forEach(genericObj => { 
                genericObj.position.x -= player.speed *.66
            })
        }
        else if (keys.left.pressed && scrolloffSet > 0) {
            scrolloffSet -= 5;
            platforms.forEach(platForm => {
                platForm.position.x += player.speed
            })
            genericObjects.forEach(genericObj => { 
                genericObj.position.x += player.speed *.66
            })
        }
    }

    if (scrolloffSet > 2000) {
        console.log('you win');
    }
    if (player.position.y > canvus.height) {
        init()
        console.log('you lose');
    }

    platforms.forEach(platForm => {
        if (player.position.y + player.height <= platForm.position.y &&
            player.position.y + player.height + player.velocity.y >= platForm.position.y &&
            player.position.x + player.width >= platForm.position.x &&
            player.position.x <= platForm.position.x + platForm.width)
            player.velocity.y = 0
    })

    if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprite.run.right) {

        player.frame = 1
        player.currentSprite = player.sprite.run.right
        player.currentCropWidth = player.sprite.run.cropWidth
        player.width = player.sprite.run.width
    }

    else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprite.run.left) {

        player.frame = 1
        player.currentSprite = player.sprite.run.left
        player.currentCropWidth = player.sprite.run.cropWidth
        player.width = player.sprite.run.width
    }
    else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprite.stand.right) {

        player.frame = 1
        player.currentSprite = player.sprite.stand.right
        player.currentCropWidth = player.sprite.stand.cropWidth
        player.width = player.sprite.stand.width
    }
    else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprite.stand.left) {

        player.frame = 1
        player.currentSprite = player.sprite.stand.left
        player.currentCropWidth = player.sprite.stand.cropWidth
        player.width = player.sprite.stand.width
    }
}
init()
animate()

addEventListener('keydown', ({ keyCode }) => {
    console.log(keyCode, 'keyCode');
    switch (keyCode) {
        case 87:
            player.velocity.y -= 10;
            break;
        case 65:
            keys.left.pressed = true
            lastKey = 'left'
            break;
        case 68:
            
            keys.right.pressed = true
            lastKey = 'right'
            break;
        case 83:
            break;
    }
})
addEventListener('keyup', ({ keyCode }) => {
    
    switch (keyCode) {
        case 87:
            break;
        case 65:
            keys.left.pressed = false
            lastKey = 'left'
            break;
        case 68:
            keys.right.pressed = false
            lastKey = 'right'
            break;
        case 83:
            break;
    }
})