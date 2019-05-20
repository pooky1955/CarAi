class Wall {
    constructor(start, end) {
        let a = start.copy()
        let b = end.copy()
        if (a.x > b.x) {
            this.start = b
            this.end = a
        } else {
            this.start = a
            this.end = b
        }
        this.touched = false
    }
    serialize() {
        return ({ x1: this.start.x, x2: this.end.x, y1: this.start.y, y2: this.end.y })
    }
    static deserialize(wallData) {
        let data = JSON.parse(wallData)
        let start = createVector(data.x1, data.y1)
        let end = createVector(data.x2, data.y2)
        return new Wall(start, end)
    }
    display() {

        strokeWeight(3 * sclF)
        line(this.start.x, this.start.y, this.end.x, this.end.y)
        this.touched = false
    }

}