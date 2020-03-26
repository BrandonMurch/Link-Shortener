const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const mongoDB = require("mongoDB.js");
app.use(express.static(path.join(__dirname + '/../')));
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/HTML');
    res.sendFile(path.join(__dirname + '/../index.html'));
});
app.get('/L/:link', async (req, res) => {
    let response = await mongoDB.handleLink(req.params.link);
    if (response[0] == 'redirect') {
        try {
            res.redirect(response[1]);
        }
        catch (err) {
            throw err;
        }
    }
    else if (response[0] == 'display') {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response[1]));
    }
});
app.listen(PORT, () => {
    console.log('Running on port: ' + PORT);
});
//# sourceMappingURL=server.js.map
