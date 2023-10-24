const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.draw()
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.draw()
    }
}

const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(x, y, 30, 'blue')
const projectiles = []
const enemies = []

function spawnEnemies() {
    setInterval(() => {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = 30
        const color = 'green'

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

spawnEnemies()

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach(projectile => projectile.update())
    enemies.forEach(enemy => enemy.update())
}

window.addEventListener('click', (event) => {
    {
        const angle = Math.atan2(
            event.clientY - canvas.height / 2,
            event.clientX - canvas.width / 2
        )

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        const projectile = new Projectile(
            player.x,
            player.y,
            5,
            'red',
            velocity
        )

        projectiles.push(projectile)
    }
})

animate()

