const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const Student = require("./models/Student");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const app = express();
app.use(cors());
app.use(express.json());
let databaseConnection;
const connectToDatabase = () => {
  if (!databaseConnection) {
    databaseConnection = mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((error) => {
        databaseConnection = null;
        throw error;
      });
  }
  return databaseConnection;
};

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    res.status(500).json({ error: "Could not connect to MongoDB." });
  }
});


app.get('/', (req, res) => {
 res.send('Server is running!');
});

app.get('/students', async (req, res) => {
 const students = await Student.find();
 res.json(students);
});

app.post('/students', async (req, res) => {
  try {
    console.log("Received student:", req.body);

    const newStudent = new Student({
      name: req.body.name,
      age: req.body.age,
      course: req.body.course
    });

    const savedStudent = await newStudent.save();

    console.log("Student saved:", savedStudent);

    res.status(201).json(savedStudent);

  } catch (error) {
    console.log("Error saving student:", error);

    res.status(500).json({
      message: "Error saving student",
      error: error.message
    });
  }
});

app.put('/students/:id', async (req, res) => {
   const { name, age, course } = req.body;
   await Student.findByIdAndUpdate(req.params.id, { name, age, course });
   res.json('Updated!');
});
app.delete('/students/:id', async (req, res) => {
   await Student.findByIdAndDelete(req.params.id);
   res.json('Deleted!');
});

if (require.main === module) {
  const port = process.env.PORT || 5001;
  connectToDatabase()
    .then(() => app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    }))
    .catch((error) => {
      console.error("Could not start server:", error.message);
      process.exit(1);
    });
}

module.exports = app;
