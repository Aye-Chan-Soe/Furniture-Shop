import express from "express";
const app = express();

app.get("/test", (req, res) => {
  res.send("Test route works!");
});

app.listen(5000, () => {
  console.log("Minimal test server running on 5000");
});
