class Editor {
    constructor() {
        this.points = []
        this.addingPoint = false
        this.center = createVector(width / 2, height / 2)
        this.editing = true
        this.innerPoints = []
        this.outerPoints = []
    }
    clear() {
        this.points = []
        this.innerPoints = []
        this.outerPoints = []
    }
    update() {
        stroke(255, 255, 0)
        for (let i in this.points) {
            i = Number(i)
            let p1 = this.points[i]
            let p2 = this.points[(i + 1) % this.points.length]
            line(p1.x, p1.y, p2.x, p2.y)
        }
        if (this.points.length > 2) {
            let CM = createVector(0, 0)
            for (let point of this.points) {
                CM.add(point)
            }
            CM.mult(1 / this.points.length)
            this.center = CM
            fill(255, 255, 0)
            ellipse(this.center.x, this.center.y, 10, 10)
        }

    }
    getWalls() {
        walls = []
        for (let i in this.outerPoints) {
            i = Number(i)
            let start = this.outerPoints[i]
            let end = this.outerPoints[(i + 1) % this.points.length]
            let wall = new Wall(start, end)
            walls.push(wall)
        }
        for (let i in this.innerPoints) {
            i = Number(i)
            let start = this.innerPoints[i]
            let end = this.innerPoints[(i + 1) % this.points.length]
            let wall = new Wall(start, end)
            walls.push(wall)
        }
    }
    generateRadialPoints(w) {
        this.outerPoints = []
        this.innerPoints = []
        for (let i in this.points) {
            i = Number(i)
            let direction = p5.Vector.sub(this.points[i], this.center)
            let mag = direction.mag()
            let inner = p5.Vector.mult(direction, ((mag - w) / mag))
            let outer = p5.Vector.mult(direction, (mag + w) / mag)
            inner.add(this.center)
            outer.add(this.center)
            this.innerPoints[i] = inner
            this.outerPoints[i] = outer
        }

    }
    getFitnessGates() {
        fitnessGates = []
        for (let i in this.points) {
            i = Number(i)
            let fitnessWall = new Wall(this.innerPoints[i], this.outerPoints[i])
            fitnessGates.push(fitnessWall)
        }
    }
    addMousePerpPoints() {
        if (between(0, mouseX, width) && between(0, mouseY, height)) {
            let mouse = createVector(mouseX, mouseY)
            this.points.push(mouse)
        }
    }
    generatePerpPoints(w) {
        if (this.points.length > 1) {
            this.lineData = []
            this.innerLines = []
            this.outerLines = []
            this.previousSlope = 0
            for (let i = 0; i < this.points.length - 1; i++) {
                i = Number(i)
                let p1 = this.points[i]
                let p2 = this.points[(i + 1) % this.points.length]
                let line = returnSlopeIntercept(p1, p2)
                let m = line.m, b = line.b

                let dx = Math.sqrt((w ** 2 / (1 + 1 / (m ** 2))))
                let dy = -dx / m
                let dB = abs(dy) + abs(m * dx)
                let b1 = dB + b
                let b2 = -dB + b
                let up, down
                if (b1 > b2) {
                    up = b2, down = b1
                } else {
                    up = b1, down = b2
                }
                if (p2.x < p1.x) {
                    this.innerLines.push({ m: m, b: up })
                    this.outerLines.push({ m: m, b: down })
                } else {
                    this.innerLines.push({ m: m, b: down })
                    this.outerLines.push({ m: m, b: up })
                }

                // strokeWeight(1)
                // stroke(255)
                // debugger
                // if (p2.x > p1.x) {
                //     stroke(255, 0, 0)
                //     makeLine(m, up, p1.x, p2.x)
                //     stroke(0, 0, 255)
                //     makeLine(m, down, p1.x, p2.x)
                // } else {
                //     stroke(255, 0, 0)
                //     makeLine(m, down, p1.x, p2.x)
                //     stroke(0, 0, 255)
                //     makeLine(m, up, p1.x, p2.x)
                // }
                // console.log('yoooo')
                // this.previousSlope = m
            }
        }
    }
    displayPerp() {
        noFill()
        stroke(255, 255, 0)
        strokeWeight(1 * sclF)
        if (this.points.length > 1) {
            beginShape()
            for (let point of this.points) {
                vertex(point.x, point.y)
            }
            endShape()
        }
        fill(255, 255, 0)
        for (let point of this.points) {
            ellipse(point.x, point.y, 10 * sclF)
        }
    }

    makePoints() {
        this.innerPoints = []
        this.outerPoints = []
        let len = this.points.length
        for (let i = 0; i < this.innerLines.length; i++) {
            i = Number(i)
            let l1 = this.innerLines[i]
            let l2 = this.innerLines[(i + 1) % len]
            let x = (l2.b - l1.b) / (l1.m - l2.m)
            let y = l1.m * x + l1.b
            this.innerPoints.push(createVector(x, y))
        }
        for (let i = 0; i < this.outerLines.length; i++) {

            i = Number(i)
            let l1 = this.outerLines[i]
            let l2 = this.outerLines[(i + 1) % len]
            let x = (l2.b - l1.b) / (l1.m - l2.m)
            let y = l1.m * x + l1.b
            this.outerPoints.push((createVector(x, y)))
        }
    }
    autocomplete(w) {
        if (this.points.length > 3) {
            let p1 = this.points[this.points.length - 1]
            let p2 = this.points[0]
            let line = returnSlopeIntercept(p1, p2)
            let m = line.m, b = line.b

            let dx = Math.sqrt((w ** 2 / (1 + 1 / (m ** 2))))
            let dy = -dx / m
            let dB = abs(dy) + abs(m * dx)
            let b1 = dB + b
            let b2 = -dB + b
            let up, down
            if (b1 > b2) {
                up = b2, down = b1
            } else {
                up = b1, down = b2
            }
            if (p2.x < p1.x) {
                this.innerLines.push({ m: m, b: up })
                this.outerLines.push({ m: m, b: down })
            } else {
                this.innerLines.push({ m: m, b: down })
                this.outerLines.push({ m: m, b: up })
            }

        }

    }
    displayTrack() {
        fill(120)
        noStroke()
        beginShape()

        if (this.points.length > 1) {
            for (let point of this.innerPoints) {
                vertex(point.x, point.y)
            }

            vertex(this.innerPoints[0].x, this.innerPoints[0].y)
            for (let i = this.outerPoints.length - 1; i >= 0; i--) {
                let point = this.outerPoints[i]
                vertex(point.x, point.y)
            }
            vertex(this.outerPoints[this.outerPoints.length - 1].x, this.outerPoints[this.outerPoints.length - 1].y)
        }
        endShape(CLOSE)
    }
}