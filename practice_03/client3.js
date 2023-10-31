const fetch = require("node-fetch");

// Function to fetch the root directory
async function fetchRootDirectory() {
    const response = await fetch("http://localhost:3000/");
    return response.json();
}

// Function to filter directories from items
function filterDirectories(items) {
    return items.filter((item) => item.isDir === true);
}

// Function to fetch directory
async function fetchDirectoryData(directory) {
    const response = await fetch(`http://localhost:3000/${directory.name}`);
    return response.json();
}

// Function to extract files from directory data
function extractFilesFromDirectory(directoryData) {
    if (directoryData.files) {
        return directoryData.files;
    }
    return [];
}

// Main function
async function main() {
    try {
        const rootData = await fetchRootDirectory();

        const directories = filterDirectories(rootData.items);

        const directoryPromises = directories.map(async (directory) => {
            const directoryData = await fetchDirectoryData(directory);
            return extractFilesFromDirectory(directoryData);
        });

        const filesArray = await Promise.all(directoryPromises);
        const files = filesArray.flat();

        console.log(files);
    } catch (err) {
        console.error(err);
    }
}

main();
