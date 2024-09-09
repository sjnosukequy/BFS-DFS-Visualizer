let screen_width = window.innerWidth;
let screen_height = window.innerHeight;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let canvas_width = 960;
let canvas_height = 540;
let move_x = 0
let move_y = 0

canvas.style.position = 'absolute';
canvas.style.width = canvas_width + 'px';
canvas.style.height = canvas_height + 'px';
canvas.style.left = (screen_width - canvas_width) / 2 + 'px';
canvas.style.top = (screen_height - canvas_height) / 2 + 'px';

let overlay = document.querySelector('.overlay');
overlay.style.position = 'absolute';
overlay.style.width = canvas_width + 'px';
overlay.style.height = canvas_height + 'px';
overlay.style.left = (screen_width - canvas_width) / 2 + 'px';
overlay.style.top = (screen_height - canvas_height) / 2 + 'px';

class Rect {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.center_x = x + width / 2
        this.center_y = y + height / 2
    }
}

class Player {
    constructor(game) {
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.game = game
        this.collide_x = false
        this.collide_y = false
        this.speed = 5
    }
    update() {
        // if (this.x < 0 && move_x < 0 || this.x + this.width > canvas_width && move_x > 0) {
        //     move_x = 0
        // }
        // if (this.y < 0 && move_y < 0 || this.y + this.height > canvas_height && move_y > 0) {
        //     move_y = 0
        // }
        this.collide_x = false
        this.collide_y = false

        // Horizontal Collision
        this.x += move_x * this.speed;
        for (let i of this.game.walls) {
            let bool = i.collide(this.get_rect())
            if (bool) {
                if (move_x > 0) {
                    this.x = i.left - this.width
                    this.collide_x = true
                }
                else if (move_x < 0) {
                    this.x = i.right
                    this.collide_x = true
                }
            }
        }
            

        // Vertical Collision
        this.y += move_y * this.speed;
        for (let i of this.game.walls) {
            let bool = i.collide(this.get_rect())
            if (bool) {
                if (move_y > 0) {
                    this.y = i.top - this.height
                    this.collide_y = true
                }
                else if (move_y < 0) {
                    this.y = i.bottom
                    this.collide_y = true
                }
            }
        }
            
    }
    draw(offset_x, offset_y) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x - offset_x, this.y - offset_y, this.width, this.height);
    }
    get_rect() {
        return new Rect(this.x, this.y, this.width, this.height);
    }
}

class Object_game {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.right = x + width
        this.bottom = y + height
        this.left = x
        this.top = y
    }

    update() {

    }

    collide(rect) {
        // HORIZONTAL CHECK
        if (rect.x + rect.width > this.x && rect.x + rect.width < this.x + this.width) {
            if (rect.y + rect.height > this.y && rect.y + rect.height < this.y + this.height)
                return true
            if (rect.y < this.y + this.height && rect.y > this.y)
                return true
        }
        if (rect.x < this.x + this.width && rect.x > this.x) {
            if (rect.y + rect.height > this.y && rect.y + rect.height < this.y + this.height)
                return true
            if (rect.y < this.y + this.height && rect.y > this.y)
                return true
        }

        // VERTICAL CHECK
        if (rect.y + rect.height > this.y && rect.y + rect.height < this.y + this.height) {
            if (rect.x + rect.width > this.x && rect.x + rect.width < this.x + this.width)
                return true
            if (rect.x < this.x + this.width && rect.x > this.x)
                return true
        }
        if (rect.y < this.y + this.height && rect.y > this.y) {
            if (rect.x + rect.width > this.x && rect.x + rect.width < this.x + this.width)
                return true
            if (rect.x < this.x + this.width && rect.x > this.x)
                return true
        }
        return false
    }

    draw(offset_x, offset_y) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - offset_x, this.y - offset_y, this.width, this.height);
    }
}

class Game {
    constructor() {
        this.walls = [new Object_game(100, 100, 100, 100)];
        this.player = new Player(this);
        this.offset_x = 0
        this.offset_y = 0
    }
    run() {
        this.offset_x += (this.player.get_rect().center_x - canvas_width / 2 - this.offset_x) / 30
        this.offset_y += (this.player.get_rect().center_y - canvas_height / 2 - this.offset_y) / 20
        this.player.update();
    }
    render() {
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        this.player.draw(this.offset_x, this.offset_y);
        for (let i of this.walls) {
            i.draw(this.offset_x, this.offset_y);
        }
    }
}



let game = new Game();
// EVENT LOOP
let targetNode = document.getElementById("updater");
const config = { attributes: true, childList: true, subtree: true };
let last_frame_time = Date.now()
let fps = 0

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            game.run();
            game.render();
            let current_time = Date.now()
            let delta_time = current_time - last_frame_time
            last_frame_time = current_time
            fps = 1000 / delta_time
            fps = Math.ceil(fps)
            setTimeout(() => {
                targetNode.innerText = 'FPS: ' + fps;
            }, 16)
        }
    }
};
// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

targetNode.innerText = 'updating';

// CONTROLS
document.addEventListener('keydown', (event) => {
    if (event.key == 'a') {
        move_x = -1
    }
    if (event.key == 'd') {
        move_x = 1
    }
    if (event.key == 'w') {
        move_y = -1
    }
    if (event.key == 's') {
        move_y = 1
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key == 'a') {
        if (move_x == -1)
            move_x = 0
    }
    if (event.key == 'd') {
        if (move_x == 1)
            move_x = 0
    }
    if (event.key == 'w') {
        if (move_y == -1)
            move_y = 0
    }
    if (event.key == 's') {
        if (move_y == 1)
            move_y = 0
    }
})