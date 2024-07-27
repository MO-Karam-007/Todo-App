const { errorMonitor } = require('events')
const fs = require('fs')
const data = fs.readFileSync('./data.json')
const parsedTasks = JSON.parse(data)


exports.createTask = (task) => {
    parsedTasks.push({ name: "MO" })
    fs.writeFileSync('./data.json', JSON.stringify(parsedTasks))
}

exports.getTasks = () => parsedTasks


exports.getTask = (id) => {
    const task = parsedTasks.find(task =>
        task.id * 1 === id * 1
    )
    return task
}


exports.daleteTask = (id) => {
    const filterdResult = parsedTasks.filter(task => task.id * 1 != id * 1)
    fs.writeFileSync('./data.json', JSON.stringify(filterdResult))

}

exports.parsingBody = (req, res) => {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();

        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                parsedBody.id = parsedTasks.length > 0 ? parsedTasks[parsedTasks.length - 1].id * 1 + 1 : 100


                if (!parsedBody.name) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "Please add the task name" }));
                    return;
                }


                parsedTasks.push(parsedBody)

                fs.writeFileSync('./data.json', JSON.stringify(parsedTasks))
                resolve(parsedTasks);

            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        })
    })
}

// Middleware function to handle CORS
exports.handleCORS = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins, replace '*' with specific origin if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
}
