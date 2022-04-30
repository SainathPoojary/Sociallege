const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

var storedId = "";
app.get("/", (req, res) => {
  let friendId = storedId;
  storedId = "";
  res.render("index", { friendId: friendId });
});

app.get("/setId/:id", (req, res) => {
  if (storedId == "") {
    storedId = req.params.id;
    res.send("1");
  } else {
    res.send("0");
  }
});

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
