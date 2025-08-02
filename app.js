const express =  require("express");
const app = express();


app.use(express.json()); 


app.get("/", (req, res) => {
  res.send("Storage Management System API Running");
});

module.exports = app;