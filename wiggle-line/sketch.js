let sound;
let peaks;

let planets = [];
let planet;

let myPlanet

async function setup() {
    createCanvas(1600, 800);
    // noLoop();

    let origin = createVector(width / 2, height / 2)

    planets[0] = mkPlanet(createVector(width / 2, 0), 200, 410);
    planets[0] = staticRoughPlanet(planets[0]);

    planets[1] = mkPlanet(createVector(width / 2, height), 200, 410);
    planets[1] = staticRoughPlanet(planets[1]);

    myPlanet = new Planet(createVector(width / 2, height), 200, 410);
}

function draw() {
    frameRate(24);
    background(220);

    myPlanet.generateRoughness()
    myPlanet.draw()

    // planets[0] = wavyPlanet(planets[0], 1 / 2);
    // planets[0] = movePlanet(planets[0])
    // drawPlanet(planets[0]);

    // planets[1] = wavyPlanet(planets[1], 1 / 2);
    // planets[1] = movePlanet(planets[1])
    // drawPlanet(planets[1]);

}

class Planet {
    constructor(origin, radius, numPoints) {
        this.origin = origin
        this.radius = radius
        this.numPoints = numPoints
        this.phase

        this.points = []
        let point = {}

        for (let i = 0; i < this.numPoints; i++) {
            let vector = createVector(this.origin.x, this.origin.y);
            vector = vector.setMag(this.radius);
            vector = vector.setHeading(i * (TWO_PI / this.numPoints));

            point = { vector: vector, newVector: vector }
            this.points[i] = point;
        }
    }

    generateRoughness() {
        for (let i = 0; i < this.numPoints; i++) {
            this.points[i].roughness = noise(i)
        }
    }

    draw() {
        // Apply parameters
        for (let point of this.points) {
            let mag = point.vector.mag()
            let newMag =
                newVector = p5.vector.setMag(this.point)
        }

        beginShape();
        for (let point of this.points) {
            let x = point.newVector.x + this.origin.x
            let y = point.newVector.y + this.origin.y
            splineProperty('tightness', 0.1)
            splineVertex(x, y)

            // reset newVector to original vector
            point.newVector = point.vector.copy()
        }
        endShape(CLOSE);

        this.phase += mouseX / width
    }
}

function mkPlanet(origin, radius, numPoints) {
    let points = []
    for (let i = 0; i < numPoints; i++) {
        let vector = createVector(origin.x, origin.y);
        vector = vector.setMag(radius);
        vector = vector.setHeading(i * (TWO_PI / numPoints));

        let point = {
            vector: vector,
            newVector: vector,
        }
        points[i] = point;
    }

    let planet = {
        origin: origin,
        radius: radius,
        numPoints: numPoints,
        points: points,
        window: 0,
    }
    return planet;
}

function staticRoughPlanet(planet) {
    let i = 0;
    // it seems for loops of this type retain reference to the original object!
    for (let point of planet.points) {
        point.roughness = noise(i)
        i++
    }
    return planet;
}

function wavyPlanet(planet, freq) {
    let i = 0;
    for (let point of planet.points) {
        let mag = point.vector.mag()

        let freq = (planet.numPoints / 2) / planet.numPoints
        let windowValue = sin(i * freq + (frameCount / 2))
        windowValue = map(windowValue, -1, 1, 0, 1) * 0.3

        point.window = windowValue

        let newMag = mag * (point.roughness * windowValue + 1)
        point.newVector = p5.Vector.setMag(point.vector, newMag)

        i++;
    }
    return planet;
}

function movePlanet(planet) {
    let movement = createVector(0, -2)
    let upperBoundary = planet.radius + (height / 10)
    let lowerBoundary = height + planet.radius + (height / 10)
    if (planet.origin.y < -upperBoundary) {
        planet.origin = createVector(planet.origin.x, lowerBoundary)
    }
    planet.origin.add(movement);

    return planet;
}

function drawPlanet(planet) {
    beginShape();
    let i = 0
    for (let point of planet.points) {
        let x = point.newVector.x + planet.origin.x + (sin(i * 5 - (frameCount / 2)) * 50)
        let y = point.newVector.y + planet.origin.y + (sin(i * 5 - (frameCount / 2)) * 50)

        splineProperty('tightness', 0.1)
        splineVertex(x, y)

        // reset newVector to original vector
        point.newVector = point.vector.copy()
        i++
    }
    endShape(CLOSE);

    planet.phase += mouseX / width
}

// function mycircle(origin, radius, numPoints) {
// const center = createVector(400, 400);
// const radius = 100;
// const numPoints = 32;

// get array of vectors along circle edge.
// let planet = [];
// for (let i = 0; i < numPoints; i++) {
//     edge[i].angle = i * (TWO_PI / numPoints);
//     edge[i].magnitude = radius;
// }

// draw circle
// for (let i = 0; i < length(planet.edge); i++)

// let vectors = [];
// // Calculate vectors
// for (let i = 0; i < numPoints; i++) {
//     let angle = i * (TWO_PI / numPoints);
//     let windowValue = map(sin(i * 0.5 - frameCount)l;a -1, 1, 0, 1);
//     let noiseValue = noise(i / 0.2) * (windowValue * 0.4) + 1;

//     let mag = radius * noiseValue;
//     // cos(angle) and sin(angle) give the horizontal
//     // and vertical offset from the center, respectively.
//     // Magnitude is the distance from the center.
//     let x = origin.x + mag * cos(angle);
//     let y = origin.y + mag * sin(angle);
//     vectors[i] = createVector(x, y);
// }

// Draw circle
//         noFill();
//     beginShape();
//     for (let i = 0; i < numPoints; i++) {
//         // circle(vectors[i].x, vectors[i].y, 5);
//         splineProperty('tightness', 0.1)
//         splineVertex(vectors[i].x, vectors[i].y)

//     }
//     endShape(CLOSE);
// }