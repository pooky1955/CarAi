
let cost
function sigmoid(x) {
    return (1 / (1 + Math.exp(-x)))
}
function dsigmoid(a) {
    return (a) * (1 - a)
}
let errorStuff;

class NeuralNetwork {
    constructor(sizes) {
        this.sizes = sizes
        //sizes is an array containing the number of neurons in each layer
        this.weights = []
        this.biases = []
        this.len = sizes.length

        this.layers = []
        for (let i = 0; i < this.len - 1; i++) {
            this.weights[i] = new Matrix(sizes[i + 1], sizes[i], true)
            this.biases[i] = new Matrix(sizes[i + 1], 1, true)
        }
        this.wLen = this.weights.length
    }
    calculateError(inputs, desiredOutputs) {
        let outputs = this.feedForward(inputs, true)

        return this.calculateCost(desiredOutputs, outputs)



    }
    copy() {
        let copy = new NeuralNetwork(this.sizes)
        for (let i = 0; i < this.wLen; i++) {
            if (!this.weights[i]) {
                debugger
            }
            copy.weights[i] = this.weights[i].copy()
            copy.biases[i] = this.biases[i].copy()
        }

        return copy
    }
    static deserialize(JSONNeuralNet) {
        return JSON.parse(JSONNeuralNet)
    }
    serialize(label) {
        saveJSON(this, label)
    }
    mutate(val, variance) {
        let copy = this.copy()
        copy.weights.forEach((matrix) => { matrix.mutate(val, variance) })
        for (let weight of copy.weights) {
            weight.mutate(val, variance)
        }
        for (let bias of copy.biases) {
            bias.mutate(val, variance)
        }
        return copy
    }
    static crossover(n1, n2) {
        let result = new NeuralNetwork(n1.sizes)

        for (let i = 0; i < n1.wLen; i++) {
            result.weights[i] = Matrix.crossover(n1.weights[i], n2.weights[i])
            result.biases[i] = Matrix.crossover(n1.biases[i], n2.biases[i])
        }

        return result
    }
    calculateApproxGradient(inputs, outputs) {
        let epsilon = 10 ** -30

        this.weights[0].data[i][j] += epsilon
        let err = this.calculateError(inputs, outputs)
        this.weights[0].data[i][j] -= 2 * epsilon
        let err2 = this.calculateError(inputs, outputs)
        let gradient = (err - err2) / (2 * epsilon)
        this.weights[0].data[i][j] += epsilon
        return gradient
    }
    feedForward(inputs, noSave) {
        this.inputs = inputs
        let nodeValues = Matrix.convertToMatrix(inputs)
        if (noSave) {
            for (let i = 0; i < this.len - 1; i++) {

                nodeValues = Matrix.mult(nodeValues, this.weights[i])

                nodeValues.add(this.biases[i])
                nodeValues = nodeValues.map(sigmoid)

            }
        } else {
            // debugger
            this.layers[0] = nodeValues

            for (let i = 0; i < this.len - 1; i++) {

                nodeValues = Matrix.mult(nodeValues, this.weights[i])

                nodeValues.add(this.biases[i])
                this.layers[i + 1] = nodeValues.copy() //this is the weighted sum, before activation
                nodeValues = nodeValues.map(sigmoid)

            }
        }
        // this.layers.push(nodeValues)
        // console.log('OUTPUT')
        // console.table(nodeValues.data)
        let output = nodeValues.convertToArray()
        return output
    }
    calculateCost(y, a, loss_function) {
        let costArr = []
        if (loss_function == 'quadratic') {
            for (let i = 0; i < y.length; i++) {

                costArr[i] = (a[i] - y[i]) ** 2

            }
            let cost = costArr.reduce((acc, el) => {
                return acc + el
            })
            return cost
        }
    }

    updateAll(i, error, a) {

        let dWeights = Matrix.vectorMult(error, Matrix.transpose(a))//generates a matrix with aT.rows X err.cols === dimensions of the weights
        dWeights = dWeights.scale(this.lr)
        let dBias = error.scale(this.lr)

        this.weights[this.wLen - i - 1].sub(dWeights)
        this.biases[this.wLen - i - 1].sub(dBias)
    }

    backPropError(layerIndex, error, a) {
        let sigmoidPrime = a.map(dsigmoid)


        error = Matrix.mult(error, Matrix.transpose(this.weights[this.wLen - layerIndex - 1]))
        error.hadamard(sigmoidPrime)
    }
    train_batch(dataset, learning_r) {
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffle(dataset)
        let total = 0
        for (let i = 0; i < dataset.length; i++) {
            total += this.train(dataset[i], learning_r)
        }
        total /= dataset.length
        return total
    }
    train(data, learning_r, noisy_gradient_true) {


        this.lr = learning_r ? learning_r : 0.01
        this.feedForward(data.inputs) //feeding forward and setting learning rate

        let y = Matrix.convertToMatrix(data.outputs)
        let a = this.layers[this.len - 1].map(sigmoid)

        let err = Matrix.sub(a, y) //calculating the difference

        let yArr = y.data[0]
        let aArr = a.data[0]
        let cost = this.calculateCost(yArr, aArr, 'quadratic') // calculating the cost


        a = this.layers[this.len - 2].map(sigmoid)
        this.updateAll(0, err, a)
        let sigmoidPrime = a.map(dsigmoid)
        err = Matrix.mult(err, Matrix.transpose(this.weights[this.wLen - 1])) //updating the output layer and propagate the error
        err.hadamard(sigmoidPrime)
        if (noisy_gradient_true) {
            err = err.noisy(10 ** -8)
        }

        for (let i = 1; i < this.len - 1; i++) {
            a = this.layers[this.len - i - 2].map(sigmoid)

            this.updateAll(i, err, a) //updating the weights and bias of layer
            this.backPropError(i, err, a) //backpropagating error
        }

        return cost
    }

}
