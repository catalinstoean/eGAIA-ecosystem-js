let treeGrowthRate = 50;
let recyclingRate = 50;
let animalPopulation = 50;
let pollution = 50;

let treePositions = [];
let animalPositions = [];
let plasticPositions = [];

function setup() {
    createCanvas(800, 600);

    // Initial tree and animal positions
    for (let i = 0; i < treeGrowthRate; i++) {
        treePositions.push(createVector(random(200, width), random(100, height)));
    }
    for (let i = 0; i < animalPopulation; i++) {
        animalPositions.push(createVector(random(200, width), random(100, height)));
    }

    // Create sliders for Tree Growth Rate and Recycling Rate
    createP('Tree Growth Rate').position(10, 10);
    treeSlider = createSlider(0, 100, treeGrowthRate);
    treeSlider.position(150, 10);
    
    createP('Recycling Rate').position(10, 50);
    recyclingSlider = createSlider(0, 100, recyclingRate);
    recyclingSlider.position(150, 50);
}

function draw() {
    background(255);

    // Update slider values
    treeGrowthRate = treeSlider.value();
    recyclingRate = recyclingSlider.value();

    // Adjust pollution based on tree growth rate and recycling rate
    adjustPollution(treeGrowthRate, recyclingRate);

    // Adjust tree, animal positions, and plastic remains based on ecosystem dynamics
    adjustEcosystem();
    adjustPlasticRemains();

    // Draw elements of the ecosystem
    drawTrees();
    drawAnimals();
    drawPlasticRemains();
    drawPollutionOverlay();
    drawSmiley();
    drawProgressBars(); // Draw progress bars for pollution and animal population
}

function drawTrees() {
    fill(0, 255, 0);
    for (let pos of treePositions) {
        // Draw tree trunk
        fill(139, 69, 19);
        rect(pos.x - 2.5, pos.y - 15, 5, 15);

        // Draw foliage
        fill(0, 255, 0);
        ellipse(pos.x, pos.y - 20, 20, 20);
    }
}

function drawAnimals() {
    fill(139, 69, 19); // Set animal color to brown
    for (let pos of animalPositions) {
        ellipse(pos.x, pos.y, 10, 10);
    }
}

function drawPlasticRemains() {
    fill(0, 0, 255); // Blue color for plastic remains
    for (let pos of plasticPositions) {
        rect(pos.x, pos.y, 10, 5); // Draw plastic remains as small rectangles
    }
}

function drawPollutionOverlay() {
    noStroke();
    fill(139, 69, 19, pollution * 2.5);
    rect(0, 0, width, height);
}

function adjustEcosystem() {
    // Adjust tree positions based on tree growth rate
    if (treePositions.length < treeGrowthRate) {
        for (let i = 0; i < treeGrowthRate - treePositions.length; i++) {
            treePositions.push(createVector(random(200, width), random(100, height)));
        }
    } else if (treePositions.length > treeGrowthRate) {
        treePositions.splice(treeGrowthRate);
    }

    // Adjust animal population based on tree growth rate and recycling rate
    let targetAnimalPopulation = Math.floor(treeGrowthRate * recyclingRate / 100);
    if (animalPositions.length < targetAnimalPopulation) {
        for (let i = 0; i < targetAnimalPopulation - animalPositions.length; i++) {
            animalPositions.push(createVector(random(200, width), random(100, height)));
        }
    } else if (animalPositions.length > targetAnimalPopulation) {
        animalPositions.splice(targetAnimalPopulation);
    }

    // Move animals slightly for animation
    for (let pos of animalPositions) {
        pos.x += random(-1, 1);
        pos.y += random(-1, 1);
    }
}

function adjustPollution(treeGrowthRate, recyclingRate) {
    if (treeGrowthRate > 70 && recyclingRate > 70) {
        pollution = max(0, pollution - 0.5); // Both are high, pollution decreases
    } else if (treeGrowthRate < 30 && recyclingRate < 30) {
        pollution = min(100, pollution + 0.5); // Both are low, pollution increases
    } else if (treeGrowthRate < 30 || recyclingRate < 30) {
        pollution = min(100, pollution + 0.2); // One is low, pollution increases slowly
    } else {
        pollution = max(0, pollution - 0.2); // Otherwise, pollution decreases slowly
    }
}

function adjustPlasticRemains() {
    // Adjust plastic remains based on recycling rate
    let targetPlasticCount = Math.floor((100 - recyclingRate) / 2);
    if (plasticPositions.length < targetPlasticCount) {
        for (let i = 0; i < targetPlasticCount - plasticPositions.length; i++) {
            plasticPositions.push(createVector(random(0, width), random(0, height)));
        }
    } else if (plasticPositions.length > targetPlasticCount) {
        plasticPositions.splice(targetPlasticCount);
    }
}

function drawSmiley() {
    let faceCenter = createVector(60, 300);
    let faceRadius = 30;

    let faceColor;
    if (pollution <= 10) {
        faceColor = color(255, 255, 0);
    } else if (pollution <= 30) {
        faceColor = color(255, 255, 102);
    } else if (pollution <= 50) {
        faceColor = color(255, 204, 102);
    } else if (pollution <= 70) {
        faceColor = color(255, 153, 102);
    } else {
        faceColor = color(255, 102, 102);
    }

    // Draw face
    fill(faceColor);
    ellipse(faceCenter.x, faceCenter.y, faceRadius * 2, faceRadius * 2);

    // Draw eyes
    fill(0);
    ellipse(faceCenter.x - 10, faceCenter.y - 10, 5, 5);
    ellipse(faceCenter.x + 10, faceCenter.y - 10, 5, 5);

    // Draw mouth based on pollution level
    noFill();
    stroke(0);
    if (pollution <= 10) {
        arc(faceCenter.x, faceCenter.y, 30, 20, 0, PI); // Happy
    } else if (pollution <= 30) {
        arc(faceCenter.x, faceCenter.y, 30, 20, 0, PI); // Smiling
    } else if (pollution <= 50) {
        line(faceCenter.x - 15, faceCenter.y + 10, faceCenter.x + 15, faceCenter.y + 10); // Sober
    } else if (pollution <= 70) {
        arc(faceCenter.x, faceCenter.y + 10, 30, 20, PI, 0); // Unhappy
    } else {
        arc(faceCenter.x, faceCenter.y + 15, 30, 20, PI, 0); // Very sad
    }
}

function drawProgressBars() {
    // Pollution progress bar
    fill(0);
    text('Pollution Level', 10, 110);
    fill(255, 0, 0);
    rect(150, 95, pollution * 2, 20); // Pollution level bar (max width 200)

    // Animal population progress bar
    fill(0);
    text('Animal Population', 10, 150);
    fill(139, 69, 19); // Set animal population bar color to brown
    rect(150, 135, animalPositions.length * 2, 20); // Animal population bar (max width 200)
}
