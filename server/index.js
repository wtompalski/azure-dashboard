const express = require("express");
const proxy = require("express-http-proxy");

const publicweb = process.env.PUBLICWEB || ".";
const app = express();

app.use(express.static(publicweb));
app.use("/api/weather", proxy("http://api.weatherapi.com/v1/current.json"));

console.log(`serving ${publicweb}`);

app.get("*", (req, res) => {
  res.sendFile(`index.html`, { root: publicweb });
});

const port = process.env.PORT || "3000";

app.listen(port, () => console.log(`API running on localhost:${port}`));
