let variance = 0.1, rate = 0.8, threshold = 0.5

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}
function nextGen(savedArr, elitism) {
    let len = Math.floor(savedArr.length * elitism)
    savedArr.sort((a, b) => { return b.fitness - a.fitness })
    let elitesArray = savedArr.slice(0, len + 1)
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