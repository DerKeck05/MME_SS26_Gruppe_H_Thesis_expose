import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend läuft!"
    });
});

app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
});