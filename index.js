const express = require('express');
const app = express();

app.use(express.static("public"));
app.set('port', (process.env.PORT || 3000));

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.listen(app.get('port'), () => {
	console.log("running");
})
