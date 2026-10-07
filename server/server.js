const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const Student = require("./models/Student");
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5001, () => {
      console.log("Server is running on port 5001");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
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
