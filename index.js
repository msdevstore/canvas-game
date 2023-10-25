const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreElem = document.querySelector('#scoreElem')
const startGameBtn = document.querySelector('#startGameBtn')
const modalElem = document.querySelector('#modalElem')
const bigScoreElem = document.querySelector('#bigScoreElem')

class Player {
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
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
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
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
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
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

const friction = 0.98
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        ctx.save() // this is really important
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore() // to here
    }

    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.radius *= friction
        this.alpha -= 0.01
    }
}

const x = canvas.width / 2
const y = canvas.height / 2

let player
let projectiles = []
let enemies = []
let particles = []

const keys = {
    a: false,
    d: false,
    s: false,
    w: false
}

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyA': keys.a = true; break
        case 'KeyD': keys.d = true; break
        case 'KeyS': keys.s = true; break
        case 'KeyW': keys.w = true; break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyA': keys.a = false; break
        case 'KeyD': keys.d = false; break
        case 'KeyS': keys.s = false; break
        case 'KeyW': keys.w = false; break
    }
})

function init() {
    player = new Player(x, y, 10, 'white', {x: 0, y: 0})
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreElem.innerHTML = 0
    bigScoreElem.innerHTML = 0
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4
        let x, y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }


        const color = `hsl(${Math.random() * 360}, 50%, 50%)`

        const angle = Math.atan2(player.y - y, player.x - x)

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

const yCnt = 30
const starDist = canvas.height / yCnt
const xCnt = Math.floor(canvas.width / starDist) + 1
const alpha0 = 50
const alpha1 = 300
const alphaMax = 0.8
function drawStars() {
    for (let i = 0; i < xCnt; i++) {
        for (let j = 0; j < yCnt; j++) {
            const starX = i * starDist
            const starY = j * starDist
            const dist = Math.abs(Math.hypot(player.x - starX, player.y - starY) - player.radius)
            let alpha = 0
            if (dist >= alpha1) alpha = alphaMax
            else if (dist > alpha0 && dist < alpha1) alpha = alphaMax * (dist - alpha0) / (alpha1 - alpha0)
            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
            ctx.arc(starX, starY, 1, 0, Math.PI * 2, false)
            ctx.fill()
            ctx.closePath()
            ctx.restore()
        }
    }
}

let animationId
let score = 0
let playerSpeed = 1.5
function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.velocity.x = 0
    player.velocity.y = 0
    if (keys.a) player.velocity.x = -playerSpeed
    else if (keys.d) player.velocity.x = playerSpeed
    if (keys.s) player.velocity.y = playerSpeed
    else if (keys.w) player.velocity.y = -playerSpeed
    player.update()
    drawStars()
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update();
        }
    })
    projectiles.forEach((projectile, index) => {
        projectile.update()

        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            })
        }
    })
    enemies.forEach((enemy, index) => {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x)

        enemy.velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        // end game
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            modalElem.style.display = 'flex'
            bigScoreElem.innerHTML = score
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            // object touch
            if (dist - enemy.radius - projectile.radius < 1) {
                // create explosions
                for (let i = 0; i < enemy.radius * 2; i ++) {
                    particles.push(
                        new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color,
                            {
                                x: (Math.random() - 0.5) * (Math.random() * 6),
                                y: (Math.random() - 0.5) * (Math.random() * 6)
                            })
                    )
                }
                if (enemy.radius - 10 > 5) {
                    score += 100
                    scoreElem.innerHTML = score

                    // enemy.radius -= 10
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    score += 250
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
            }
        })
    })
}

window.addEventListener('click', (event) => {
    {
        const angle = Math.atan2(
            event.clientY - player.y,
            event.clientX - player.x
        )

        const velocity = {
            x: Math.cos(angle) * 4,
            y: Math.sin(angle) * 4
        }

        const projectile = new Projectile(
            player.x,
            player.y,
            5,
            'white',
            velocity
        )

        projectiles.push(projectile)
    }
})

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalElem.style.display = 'none'
})


