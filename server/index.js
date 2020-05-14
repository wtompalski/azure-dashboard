const express = require("express");
const proxy = require("express-http-proxy");

const publicweb = process.env.PUBLICWEB || ".";
const app = express();

app.use(express.static(publicweb));
app.use("/api/weather", proxy("http://api.weatherapi.com"));
app.use(
  "/api/exchange",
  proxy("www.ecb.europa.eu", {
    https: true,
  })
);
app.use(
  "/api/stocks",
  proxy("finnhub.io", {
    https: true,
  })
);

console.log(`serving ${publicweb}`);

app.get("*", (req, res) => {
  res.sendFile(`index.html`, { root: publicweb });
});

const port = process.env.PORT || "3000";

app.listen(port, () => console.log(`API running on localhost:${port}`));
