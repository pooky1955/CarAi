class Car {
    constructor(brain = new NeuralNetwork([numSights, 7, 2]), special = false) {
        this.position = start.copy()
        this.brain = brain
        this.special = special
        this.velocity = createVector(0, 0)
        this.acceleration = createVector(0, 0)
        this.angle = startAngle
        this.h = 10 * sclF
        this.w = 30 * sclF
        this.mass = 10
        this.state = true
        this.fitness = 0
        this.expectedGateIndex = 0
        this.lifetime = 100

    }
    checkFitnessGate() {
        let gate = fitnessGates[this.expectedGateIndex]
        let colliding = this.isColliding(gate)
        if (colliding) {
            this.fitness += 100
            this.lifetime = 300
            this.expectedGateIndex = (this.expectedGateIndex + 1) % fitnessGates.length
        }
    }
    turn(dir) {
        let step = 0.05
        if (dir == 'LEFT') {

            this.angle -= step
        } else if (dir == 'RIGHT') {
            this.angle += step
        }
        this.dir = dir
    }
    see(a) {
        let dir = {}
        dir.end = new p5.Vector(1, 0)
        dir.end = rotateVector(dir.end, this.angle + a)


        dir.end = dir.end.setMag(100)
        dir.end = dir.end.add(this.position)
        dir.start = this.position.copy()
        // line(dir.start.x, dir.start.y, dir.end.x, dir.end.y)
        // console.log(dir)
        let results = []
        let min = 1 / 0
        if (this.walls.length > 0) {
            for (let i = 0; i < this.walls.length; i++) {

                let result = findIntersect(dir, this.walls[i])
                if (result.onWall) {
                    results.push(result)
                }
            }

            // let chosenIndex = 0
            let debugging = false
            if (this.special && debugging) {

                let chosenIndex = 0
                for (let i = 0; i < results.length; i++) {
                    if (results[i].distance < min) {
                        min = results[i].distance
                        chosenIndex = i
                    }
                }
                if (results[chosenIndex]) {
                    stroke(255)
                    strokeWeight(1)
                    let pos = results[chosenIndex].collidingPoint
                    line(this.position.x, this.position.y, pos.x, pos.y)
                    let distance = getDistance(this.position.x, this.position.y, pos.x, pos.y)
                    distance = Math.round(distance)
                    let avg = p5.Vector.add(pos, this.position)
                    avg.mult(0.5)
                    fill(255)
                    push()
                    translate(avg.x, avg.y)
                    strokeWeight(0)
                    textSize(15)
                    rotate(this.angle + a)
                    text(distance, 0, 20)
                    pop()
                    fill(0, 255, 0)
                    ellipse(results[chosenIndex].collidingPoint.x, results[chosenIndex].collidingPoint.y, 5, 5)
                }
            } else {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].distance < min) {
                        min = results[i].distance
                        // chosenIndex = i
                    }
                }
            }

        }
        return min
    }
    think(walls) {
        // console.log('walls', walls)
        // console.log('walls', this.walls)
        this.walls = walls
        this.inputs = []



        for (let i = 0; i < numSights; i++) {
            let angle = -PI / 2 + PI * i / (numSights)
            let input = this.see(angle)
            this.inputs.push(1 / input)
        }
        this.outputs = this.brain.feedForward(this.inputs)
        let angle = map(this.outputs[0], 0, 1, -1, 1)
        if (this.outputs[1] > 0.5) {
            this.thrusting = true
        } else {
            this.thrusting = false
        }
        this.angle += angle
    }
    checkAll(walls) {
        for (let wall of walls) {
            let isColliding = this.isColliding(wall)
            if (isColliding) {
                this.state = false
            }
        }
    }
    isColliding(wall) {
        // console.log('hey')
        let topLeft = new p5.Vector(- this.w / 2, - this.h / 2)
        let topRight = new p5.Vector(+ this.w / 2, - this.h / 2)
        let bottomLeft = new p5.Vector(- this.w / 2, + this.h / 2)
        let bottomRight = new p5.Vector(+ this.w / 2, + this.h / 2)
        let straightStart = createVector(0, 0)
        let straightEnd = this.velocity.copy()
        topLeft = rotateVector(topLeft, this.angle)
        topRight = rotateVector(topRight, this.angle)
        bottomLeft = rotateVector(bottomLeft, this.angle)
        bottomRight = rotateVector(bottomRight, this.angle)


        topLeft.add(this.position)
        topRight.add(this.position)
        bottomLeft.add(this.position)
        bottomRight.add(this.position)
        let straight = findIntersect({ start: straightStart, end: straightEnd }, wall)
        if (straight.distance < this.velocity.mag() + maxForce && straight.onWall) {
            return true
        }
        let top = findIntersect({ start: topLeft, end: topRight }, wall)
        let left = findIntersect({ start: topLeft, end: bottomLeft }, wall)
        let bottom = findIntersect({ start: bottomLeft, end: bottomRight }, wall)
        let right = findIntersect({ start: topRight, end: bottomRight }, wall)
        let intersectionPoints = [top, bottom, left, right]
        let returnValue = false

        for (let i = 0; i < intersectionPoints.length; i++) {
            let data = intersectionPoints[i]
            let threshold = i >= 2 ? this.h : this.w
            if (data.distance < threshold && data.onWall) {
                returnValue = true
                break

            }
        }
        return returnValue
    }
    update() {
        this.lifetime--
        if (this.lifetime < 0) {
            this.state = false
        }
        this.think(walls)
        this.checkAll(walls)
        this.checkFitnessGate()
        this.acceleration.set(0, 0)

        if (this.thrusting) {
            let thrust = angleToVec(this.angle, maxForce)
            this.acceleration.add(thrust)
        }
        this.turn(this.dir)
        let friction = p5.Vector.mult(this.velocity, -frictionCoefficient)
        this.acceleration.add(friction)
        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)

    }
    display() {
        strokeWeight(1)
        stroke(0)
        fill(0)
        if (this.special) {
            fill(123, 123, 123)
        }
        if (!this.state) {
            fill(255, 0, 0)
        }
        push()
        translate(this.position.x, this.position.y)
        rectMode(CENTER)
        rotate(this.angle)
        rect(0, 0, this.w, this.h)
        fill(25, 125, 255)
        rect(10 * sclF, 0, this.w / 3, this.h / 3)
        pop()
        stroke(0, 255, 0)
        fitnessGates[this.expectedGateIndex].display()
    }
}