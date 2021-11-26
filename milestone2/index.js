const devCardController = require('./controllers/devCardController');

const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();

// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("createcard");
});

app.get("/test", (req, res) => {
    res.render("homepage");
})

app.post('/devCards/create', (req, res) => {
    devCardController.formCreationSubmit(req, res)
})

app.get("/people/:id", (req, res) => {
    devCardController.showUserById(req, res)
})

app.get("/getIcon/:title", (req, res) => {
    devCardController.getIconByTitle(req, res)
})

app.get("/getIcon", (req, res) => {
    res.end(JSON.stringify({
        status: false
    }))
})

app.get("/:id/photos", (req, res) => {
    const id = req.params.id;
});

app.listen(PORT, () => {
    console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});
