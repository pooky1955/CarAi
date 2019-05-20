function rotateVector(vec, a) {
    let r = vec.mag()
    let initialA = vec.heading()
    return new p5.Vector(r * cos(a - initialA), r * sin(a - initialA))
}
function findDoubleLinesIntersect(l1s, l2s) {
    let inin = findLineIntersect(l1s[0], l2s[0])
    let inout = findLineIntersect(l1s[0], l2s[1])
    let outin = findLineIntersect(l1s[1], l2s[0])
    let outout = findLineIntersect(l1s[1], l2s[1])

}
function findLineIntersect(l1, l2) {
    let x = (l2.b - l1.b) / (l1.m - l2.m)
    let y = l2.m * x + l2.b
    if (getPoint(x, l1).y !== getPoint(x, l2)) {
        debugger
        console.warn('not equal')
    }
    let lineStart = getPoint(0, l1)
    let dist = getDistance(lineStart.x, lineStart.y, x, y)
    return { dist: dist, collidingPoint: createVector(x, y) }
}
function getPoint(x, line) {
    return createVector(x, line.m * x + line.b)
}
function findIntersect(points1, points2) {

    let line1 = returnSlopeIntercept(points1.start, points1.end)
    let line2 = returnSlopeIntercept(points2.start, points2.end)
    let collidingPoint;
    //console.log(line1.xIntercept, line2.xIntercept)
    if (line1.xIntercept && line2.xIntercept) {
        //handle cases when not a function
        if (line1.xIntercept !== line2.xIntercept) {
            collidingPoint = createVector(Infinity, Infinity)
        }

    } else if (line2.xIntercept !== undefined) {
        // console.log(`line2's xIntercept = ${line2.xIntercept}`)
        let x = line2.xIntercept
        let y = line1.m * x + line1.b
        collidingPoint = (createVector(x, y))
    } else if (line1.xIntercept !== undefined) {
        let x = line1.xIntercept
        let y = line2.m * x + line2.b
        collidingPoint = (createVector(x, y))
    } else {
        let collidingPointX = (line2.b - line1.b) / (line1.m - line2.m)
        let collidingPointY = line2.m * collidingPointX + line2.b
        collidingPoint = (createVector(collidingPointX, collidingPointY))

    }
    let obj = { point: collidingPoint, points1: points1, points2: points2 }


    let meanX = (points1.start.x + points1.end.x) / 2
    let meanY = (points1.start.y + points1.end.y) / 2

    let distance = getDistance(meanX, meanY, collidingPoint.x, collidingPoint.y)
    let onWall = within(collidingPoint.x, points2.start.x, points2.end.x)
    return ({ distance: distance, sign: ((points1.end.x - points1.start.x) * (collidingPoint.x - points1.start.x) > 0 ? 1 : -1), onWall: onWall, collidingPoint: collidingPoint })

}
function getDistance(x1, y1, x2, y2) {
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}
function within(value, a, b) {
    a = Math.min(a, b)
    b = Math.max(a, b)
    return (value > a && value < b)
}
function returnSlopeIntercept(point1, point2) {
    //  console.log(point1, point2)
    let slope = (point2.y - point1.y) / (point2.x - point1.x)
    // console.log(`${point2.y}-${point1.y} / ${point2.x}- ${point1.x} = ${slope}`)

    let intercept = point2.y - point2.x * slope
    let obj = ({ m: slope, b: intercept })
    // console.log(`y = ${slope}x + ${intercept}`)
    if (point1.x == point2.x) {
        // console.log(`hey`)
        obj.xIntercept = point1.x
        // console.log(`x = ${obj.xIntercept}`)
    }
    // console.log(obj)
    return obj
}
function makeLine(m, b, x1, x2) {
    let y1 = m * x1 + b
    let y2 = m * x2 + b
    line(x1, y1, x2, y2)
}
function angleToVec(angle, r) {
    return createVector(r * Math.cos(angle), r * Math.sin(angle))
}

function between(min, x, max) {
    return min <= x && x <= max
}
