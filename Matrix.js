function randomGauss() {
    do {
        var x1 = Math.random() * 2 - 1;
        var x2 = Math.random() * 2 - 1;
        var w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt((-2 * Math.log(w)) / w);
    return x1 * w;
}
class Matrix {
    constructor(rows, cols, isRandom) {
        this.rows = rows
        this.cols = cols
        this.data = []
        if (isRandom) {
            for (let i = 0; i < cols; i++) {
                this.data[i] = []
                for (let j = 0; j < rows; j++) {
                    // this.data[i][j] = (randomGauss()) / (rows)
                    this.data[i][j] = Math.random() * 2 - 1
                }

            }
        } else {
            for (let i = 0; i < cols; i++) {
                this.data[i] = []
                for (let j = 0; j < rows; j++) {
                    this.data[i][j] = 0
                }
            }
        }
    }
    map(func) {
        let result = new Matrix(this.rows, this.cols)
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                result.data[i][j] = func(this.data[i][j])
                if (isNaN(result.data[i][j])) {
                    debugger
                }
            }
        }
        return result
    }
    randomize() {
        this.map((el) => { return Math.random() * 2 - 1 })
    }

    static vectorMult(v1, v2) {
        let result = new Matrix(v1.rows, v2.cols)
        // console.table(v1.data)
        // console.log('X')
        // console.table(v2.data)
        for (let i = 0; i < result.cols; i++) {
            for (let j = 0; j < result.rows; j++) {
                result.data[i][j] = v1.data[0][j] * v2.data[i][0]
                // console.log(`result ${i}${j} = ${v1.data[0][j]} * ${v2.data[i][0]}`)
                if (isNaN(result.data[i][j])) {
                    debugger
                }
            }

        }
        // console.table(result.data)
        return result
    }
    add(matrixN) {
        if (matrixN.rows === this.rows && matrixN.cols === this.cols) {//check if same dimensions
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    //cycle each element and add the two elemnts

                    this.data[i][j] += matrixN.data[i][j]
                    if (isNaN(this.data[i][j])) {
                        debugger
                    }
                }
            }

        }
    }
    static euclideanDistance(m1, m2) {
        let m3 = Matrix.sub(m1, m2)
        m3.map((el) => { return el ** 2 })
        let sum = 0
        for (let i = 0; i < m3.cols; i++) {
            for (let j = 0; j < m3.rows; j++) {
                sum += m3.data[i][j]
            }
        }
        return sum
    }
    scale(n) {
        let result

        result = this.map((el) => { return el * n })

        return result

    }
    sub(matrixN) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.data[i][j] -= matrixN.data[i][j]
                if (this.data[i][j] == NaN) {
                    debugger
                }
            }
        }
    }
    static sub(m, n) {
        let result = new Matrix(m.rows, m.cols)
        for (let i = 0; i < m.cols; i++) {
            for (let j = 0; j < m.rows; j++) {
                result.data[i][j] = m.data[i][j] - n.data[i][j]
                if (isNaN(result.data[i][j])) {
                    debugger
                }
            }
        }
        return result
    }
    hadamard(matrixN) {
        //check if same dimensions
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                //cycle each element and add the two elemnts
                this.data[i][j] *= matrixN.data[i][j]
                if (isNaN(this.data[i][j])) {
                    debugger
                }
            }
        }



    }
    copy() {
        let result = new Matrix(this.rows, this.cols)
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                result.data[i][j] = this.data[i][j]
            }
        }
        return result
    }
    static convertToMatrix(arr) {
        let result = new Matrix(arr.length, 1)
        // console.log(result)
        //debugger
        for (let i = 0; i < arr.length; i++) {

            result.data[0][i] = arr[i]
            // debugger
        }
        return result
    }
    convertToArray() {
        if (this.data.length === 1) {
            return this.data[0]
        } else {
            return this.data
        }
    }
    static mult(vector, matrix) {
        //vector is just matrix with one col
        // console.table(matrix.data)
        let result = new Matrix(matrix.rows, 1)


        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < vector.rows; j++) {
                // debugger
                result.data[0][i] += matrix.data[j][i] * vector.data[0][j]
            }
            if (isNaN(result.data[0][i])) {
                debugger
            }
        }


        return result
    }
    noisy(val) {
        this.map((el) => { return el + randomGauss() * val })
    }
    static transpose(matrix) {
        let result = new Matrix(matrix.cols, matrix.rows)

        for (let i = 0; i < matrix.cols; i++) {
            for (let j = 0; j < matrix.rows; j++) {
                result.data[j][i] = matrix.data[i][j]
                if (isNaN(result.data[j][i])) {
                    debugger
                }
            }
        }
        return result
    }
    mutate(threshold, variation) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (Math.random() < threshold) {
                    if (Math.random() < 0.8) {
                        this.data[i][j] += (Math.random() * 2 - 1) * variation
                    } else {
                        this.data[i][j] = Math.random() * 2 - 1
                    }
                }
            }
        }

    }
    static crossover(m, n) {
        let result
        if (m.rows === n.rows && m.cols === n.cols) {
            result = new Matrix(m.rows, m.cols)
            for (let i = 0; i < m.cols; i++) {
                for (let j = 0; j < m.rows; j++) {
                    result.data[i][j] = Math.random() > 0.5 ? m.data[i][j] : n.data[i][j]
                }

            }
        } else {
            debugger
        }
        return result
    }
}