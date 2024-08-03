const Express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = Express();
app.use(Express.json());
app.use(cors());
const port = 5038;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  next();
});

const connectString =
  "mongodb+srv://tartejbros:Rr5rnp6PAQng3lHr@todoapp.wrcgueg.mongodb.net/tododb?retryWrites=true&w=majority";

const schema = new mongoose.Schema({
  id: Number,
  task: String,
});

const todo = mongoose.model("todocollections", schema);
const counterschema = new mongoose.Schema({
  id: String,
  count: Number,
});
const countermodel = mongoose.model("countermodels", counterschema);

app.get("/todoapp", (request, response) => {
  todo
    .find()
    .then((result) => {
      response.send(result);
    })
    .catch((err) => {
      console.log(err);
      response.status(500).send("Internal Server Error");
    });
});

app.post("/todoapp/new", async (request, response) => {
  try {
    let result = await countermodel.findOneAndUpdate(
      { id: "autoval" },
      { $inc: { count: 1 } },
      { new: true }
    );

    let countid;
    if (!result) {
      const newval = new countermodel({ id: "autoval", count: 1 });
      await newval.save();
      countid = 1;
    } else {
      countid = result.count;
    }

    const addvalue = new todo({
      id: countid,
      task: request.body.task,
    });

    await addvalue.save();
    response.status(200).json({ message: "Todo added successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server Error" });
  }
});

app.delete("/todoapp/delete/:id", async (request, response) => {
  try {
    const result = await todo.deleteOne({ id: request.params.id });
    response.status(200).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server Error" });
  }
});
const start = async () => {
  try {
    await mongoose.connect(connectString);
    console.log("Connected to the database");

    app.listen(port, () => {
      console.log("Server started at port 5038");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

start();
