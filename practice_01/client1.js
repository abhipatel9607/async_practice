const fetch = require("node-fetch");

// Function to fetch user data
async function fetchUserData() {
    const response = await fetch("http://localhost:3000/users");
    return response.json();
}

// Function to fetch and get completed todos data for a user
async function fetchAndProcessTodos(user) {
    const fetchTodos = await fetch(`http://localhost:3000${user.todos}`);
    const todosData = await fetchTodos.json();
    const completedTodosLength = todosData.todos.filter((todo) => todo.isCompleted === true).length;

    return {
        "id": user.id,
        "name": user.name,
        "numTodosCompleted": completedTodosLength
    };
}

// Function to create a delay
function createDelay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Main function
async function main() {
    try {
        const userData = await fetchUserData();
        const users = userData.users;

        const chunkSize = 5;
        let startIndex = 0;

        while (startIndex < users.length) {
            const chunkUsers = users.slice(startIndex, startIndex + chunkSize);
            startIndex += chunkSize;

            const chunkUsersPromise = chunkUsers.map((user) => fetchAndProcessTodos(user));

            const userTodos = await Promise.all(chunkUsersPromise);
            console.log(userTodos);

            await createDelay(1000);
        }
    } catch (error) {
        console.error(error);
    }
}

main();
