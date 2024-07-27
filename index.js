const http = require('http')
const { creataTask, getTasks, getTask, parsingBody, handleCORS, daleteTask } = require('./controller')
const path = require('path');
const fs = require('fs')

http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        handleCORS(req, res);
        res.statusCode = 204; // No Content
        res.end();
        return;
    }
    handleCORS(req, res);

    //  handle request with GET method  with id
    if (req.method === 'GET' && req.url.match(/\d+/)) {
        const taskId = req.url.match(/\/task\/(\d+)/)
        const task = getTask(taskId[1]);
        if (!task) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Task not found" }));
            return;
        }
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify({ task }))
        return;
    }


    if (req.method === 'GET' && req.url === '/home') {
        const filePath = path.join(__dirname, 'static/index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = err.code === 'ENOENT' ? 404 : 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Internal Server Error');
                console.error(err);
                return;
            }
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            res.end(data);
        });
        return;
    }


    if (req.method === 'GET' && req.url === '/tasks') {
        const tasks = getTasks();
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ tasks: tasks }));
        return;
    }



    if (req.method === 'POST') {

        let parsedBody = await parsingBody(req, res)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: "Task Created successfully", data: parsedBody }));
        return
    }

    if (req.method === 'DELETE' && req.url.match(/\d+/)) {
        const taskId = req.url.match(/\/task\/(\d+)/)
        const task = daleteTask(taskId[1]);
        if (!task) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Task not found" }));
            return;
        }
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify({ task }))
        return;
    }

    // Handle other routes...
    res.statusCode = 405; // Method Not Allowed
    res.setHeader('Content-Type', 'text/plain');
    res.end('Method Not Allowed');
})
    .listen(3030, () => {
        console.log('Server is running on port 3000')
    })