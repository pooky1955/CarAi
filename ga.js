let variance = 0.1, rate = 0.8, threshold = 0.5, bestLaps = 0

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}
function nextGen(savedArr, elitism) {
    gen++
    let len = Math.floor(savedArr.length * elitism)
    savedArr.sort((a, b) => { return b.fitness - a.fitness })
    let elitesArray = savedArr.slice(0, len + 1)
    let bestFit = elitesArray[0].fitness
    let laps = Math.floor(bestFit / (editor.points.length * 100))
    bestLaps = Math.max(laps, bestLaps)
    let newGen = []
    for (let i = 0; i < population - len; i++) {
        let child = pickRandom(elitesArray)

        let childBrain = child.brain.mutate(rate, variance)
        let babyCar = new Car(brain = childBrain)
        newGen.push(babyCar)
    }
    for (let i = 0; i < elitesArray.length; i++) {
        let child = elitesArray[i]
        let childBrain = child.brain
        let babyCar = new Car(brain = childBrain, special = true)
        newGen.push(babyCar)
    }
    savedNECars = []
    NECars = newGen
}