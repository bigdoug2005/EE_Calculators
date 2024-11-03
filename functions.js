function calculateRground() {
    let vin = parseFloat(document.getElementById("vin").value);
    let voutDesired = parseFloat(document.getElementById("vout-desired").value);
    let rsource = parseFloat(document.getElementById("rsource").value) * parseFloat(document.getElementById("rsource-multiplier").value);

    let rground = (voutDesired * rsource) / (vin - voutDesired);

    document.getElementById("rground").textContent = rground.toFixed(2);
    
    const nearestE96 = findNearestE96(rground);

    document.getElementById("lesser-value").textContent = nearestE96.lesser !== null ? formatResistorValue(nearestE96.lesser) : "None";
    document.getElementById("greater-value").textContent = nearestE96.greater !== null ? formatResistorValue(nearestE96.greater) : "None";

    document.getElementById("lesser-value-output").textContent = `${(vin*(nearestE96.lesser/(rsource+nearestE96.lesser))).toFixed(3)} V`;
    document.getElementById("greater-value-output").textContent = `${(vin*(nearestE96.greater/(rsource+nearestE96.greater))).toFixed(3)} V`;
    
    document.getElementById("lesser-input").textContent = `${(voutDesired/(nearestE96.lesser/(nearestE96.lesser+rsource))).toFixed(3)} V`;
    document.getElementById("greater-input").textContent = `${(voutDesired/(nearestE96.greater/(nearestE96.greater+rsource))).toFixed(3)} V`;
    
}

const BASE_E96_VALUES = [
    1.00, 1.02, 1.05, 1.07, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 
    1.27, 1.30, 1.33, 1.37, 1.40, 1.43, 1.47, 1.50, 1.54, 1.58, 
    1.62, 1.65, 1.69, 1.74, 1.78, 1.82, 1.87, 1.91, 1.96, 2.00, 
    2.05, 2.10, 2.15, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49, 2.55, 
    2.61, 2.67, 2.74, 2.80, 2.87, 2.94, 3.01, 3.09, 3.16, 3.24, 
    3.32, 3.40, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12, 
    4.22, 4.32, 4.42, 4.53, 4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 
    5.36, 5.49, 5.62, 5.76, 5.90, 6.04, 6.19, 6.34, 6.49, 6.65, 
    6.81, 6.98, 7.15, 7.32, 7.50, 7.68, 7.87, 8.06, 8.25, 8.45, 
    8.66, 8.87, 9.09, 9.31, 9.53, 9.76
];

function generateE96Values() {
    const decades = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];
    let values = [];

    for (let decade of decades) {
        for (let baseValue of BASE_E96_VALUES) {
            values.push(baseValue * decade);
        }
    }
    return values;
}

function formatResistorValue(value) {
    if (value < 1000) return `${value.toFixed(2)} Ω`;
    else if (value < 1000000) return `${(value/1000).toFixed(2)} kΩ`;
    else return `${(value/1000000).toFixed(2)} MΩ`;
}

const E96_VALUES = generateE96Values();

function findNearestE96(inputValue) {
    if (inputValue <= E96_VALUES[0]) {
        return {
            lesser: null,
            greater: E96_VALUES[0]
        };
    }
    if (inputValue >= E96_VALUES[E96_VALUES.length - 1]) {
        return {
            lesser: E96_VALUES[E96_VALUES.length - 1],
            greater: null
        };
    }

    for (let i = 0; i < E96_VALUES.length - 1; i++) {
        if (inputValue === E96_VALUES[i]) {
            return {
                lesser: E96_VALUES[i],
                greater: E96_VALUES[i]
            };
        }
        if (inputValue > E96_VALUES[i] && inputValue < E96_VALUES[i + 1]) {
            return {
                lesser: E96_VALUES[i],
                greater: E96_VALUES[i + 1]
            };
        }
    }
}

function calculateNearestE96() {
    let inputValue = parseFloat(document.getElementById("resistor-value").value) * parseFloat(document.getElementById("resistor-multiplier").value);
    const nearestE96 = findNearestE96(inputValue);
    document.getElementById("lesser-e96value").textContent = nearestE96.lesser !== null ? formatResistorValue(nearestE96.lesser) : "None";
    document.getElementById("greater-e96value").textContent = nearestE96.greater !== null ? formatResistorValue(nearestE96.greater) : "None";
 
}

function calculateIPCThroughHole() {
    let leadDiameter = parseFloat(document.getElementById("lead-diameter").value);

    if (isNaN(leadDiameter) || leadDiameter <= 0) {
        alert("Please enter a valid lead diameter.");
        return;
    }

    // Calculate minimum hole sizes
    let levelAHoleSize = leadDiameter + 0.25;
    let levelBHoleSize = leadDiameter + 0.20;
    let levelCHoleSize = leadDiameter + 0.15;

    // Calculate pad diameters
    let levelAPadDiameter = levelAHoleSize + 0.1 + 0.60;
    let levelBPadDiameter = levelBHoleSize + 0.1 + 0.50;
    let levelCPadDiameter = levelCHoleSize + 0.1 + 0.40;

    // Update hole size outputs
    document.getElementById("level-a-hole-size").textContent = levelAHoleSize.toFixed(2);
    document.getElementById("level-b-hole-size").textContent = levelBHoleSize.toFixed(2);
    document.getElementById("level-c-hole-size").textContent = levelCHoleSize.toFixed(2);

    // Update pad diameter outputs
    document.getElementById("level-a-pad-diameter").textContent = levelAPadDiameter.toFixed(2);
    document.getElementById("level-b-pad-diameter").textContent = levelBPadDiameter.toFixed(2);
    document.getElementById("level-c-pad-diameter").textContent = levelCPadDiameter.toFixed(2);
}