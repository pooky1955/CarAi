
let car, savedNECars = [], editor, NECars = [], walls = [], fitnessGates = [], start, population = 500, startAngle = 0, varianceSlider, variancelabel
let maxForce = 1, frictionCoefficient = 0.125, numSights = 8, cycles = 1, elitism = 0.01, sclF, button, speedSlider, mutationSlider
let streetWidthSlider, streetWidthLabel, streetWidthValue = 50, gen = 0
function setup() {
    createCanvas(window.innerWidth / 2, window.innerWidth / 2)
    button = document.querySelector('#button')
    speedSlider = document.querySelector('#speed')
    speedLabel = document.querySelector('#speedlabel')
    mutationSlider = document.querySelector('#mutationrate')
    mutationlabel = document.querySelector('#mutationratelabel')
    varianceSlider = document.querySelector('#variance')
    variancelabel = document.querySelector('#variancelabel')
    button = document.querySelector('#gamebutton')
    streetWidthSlider = document.querySelector('#streetwidth')
    streetWidthLabel = document.querySelector('#streetwidthlabel')
    editor = new Editor()
    document.querySelector('#resetbutton').onclick = function () {
        editor.editing = true
        editor.clear()
    }
    button.onclick = function () {
        editor.editing = !editor.editing
        button.innerHTML = editor.editing ? 'Complete track' : 'Go back and edit'
        if (!editor.editing) {
            if (editor.points.length > 2) {
                switchtoGame()
            } else {
                alert('Add more points')
                editor.editing = true
                editor.clear()
            }
        }
    }
    sclF = width / 800
}
function initializePopulation() {
    for (let i = 0; i < population; i++) {
        NECars[i] = new Car()
    }
}

function draw() {
    cycles = 2 ** Number(speedSlider.value)
    speedLabel.innerHTML = `${cycles}x`
    variance = Number(varianceSlider.value)
    variancelabel.innerHTML = `${variance}x`
    threshold = Number(mutationSlider.value)
    mutationlabel.innerHTML = `${threshold}`
    streetWidthLabel.innerHTML = streetWidthSlider.value
    streetWidthValue = Number(streetWidthSlider.value)
    push()

    background(51)
    if (!editor.editing) {
        editor.displayTrack()
        stroke(0)

        for (let j = 0; j < cycles; j++) {
            for (let i = 0; i < NECars.length; i++) {
                let car = NECars[i]
                if (car.state) {
                    car.update()
                } else {
                    car.fitness += (300 - car.lifetime) / 6
                    savedNECars.push(car)
                    NECars.splice(i, 1)
                    i--
                }
            }
            if (NECars.length == 0) {
                nextGen(savedNECars, elitism)
            }
        }
        for (let car of NECars) {
            car.display()
        }
        for (let wall of walls) {
            wall.display()
        }
    } else {
        stroke(255, 0, 0)
        strokeWeight(5)
        editor.displayPerp()
        editor.generatePerpPoints(streetWidthValue * sclF)
        stroke(0)
    }
    let message = editor.editing ? 'Editing Mode' : 'Game Mode'
    fill(255)
    strokeWeight(0)
    textSize(50 * sclF)
    text(message, width * 0.6, height * 0.1)
    let message2 = `Gen : ${gen} , Best Laps : ${bestLaps}`
    text(message2, width * 0.3, height * 0.9)
    pop()
}
function mousePressed() {

    start = editor.points[0] || createVector(width / 2, height / 2)
    if (editor.editing) {
        if (within(mouseX, 0, width) && within(mouseY, 0, height)) {

            editor.points.push(createVector(mouseX, mouseY))
            editor.generatePerpPoints(mouseX)
        }

    }

}
function switchtoGame() {
    editor.autocomplete(50 * sclF)
    editor.makePoints()
    editor.getWalls()
    editor.getFitnessGates()
    if (NECars.length == 0) {
        initializePopulation()
    }
    startAngle = p5.Vector.sub(editor.points[1], editor.points[0]).heading()
    for (let car of NECars) {
        car.position.set(start.x, start.y)
        car.angle = startAngle

    }
}
function keyPressed(e) {
    if (e.key == 'q') {
        editor.editing = !editor.editing
        button.innerHTML = editor.editing ? 'Complete track' : 'Go back and edit'
        if (!editor.editing) {
            switchtoGame()
        }
    }
    if (e.key == 'x') {
        editor.editing = true
        button.innerHTML = 'Complete track'
        editor.clear()
    }

}
