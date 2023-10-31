const fetch = require("node-fetch");

// Function to fetch data from the initialize URL
async function fetchInitializeData() {
    const response = await fetch("http://localhost:3000/initialize");
    return response.json();
}

// Function to fetch a pair of values for given row and column
async function fetchValuePair(row, col) {
    const fetchValue1 = fetch(`http://localhost:3000/value?rowIndex=${row}&colIndex=${col}`);
    const fetchValue2 = fetch(`http://localhost:3000/value?rowIndex=${row}&colIndex=${col + 1}`);

    const [res1, res2] = await Promise.all([fetchValue1, fetchValue2]);

    const value1 = await res1.json();
    const value2 = await res2.json();

    return [value1.value, value2.value];
}

// Function to create matrix
async function buildMatrix(data) {
    const length = data.size;
    const matrix = [];

    for (let row = 0; row < length; row++) {
        const curRow = [];

        for (let col = 0; col < length; col += 2) {
            const [value1, value2] = await fetchValuePair(row, col);
            curRow.push(value1, value2);
        }

        matrix.push(curRow);
    }

    return matrix;
}

// Main function
async function main() {
    try {
        const initializeData = await fetchInitializeData();
        const matrix = await buildMatrix(initializeData);
        console.log(matrix);
    } catch (error) {
        console.error(error);
    }
}

main();
