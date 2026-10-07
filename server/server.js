const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const Student = require("./models/Student");
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
mongoose

 .connect(process.env.MONGO_URI)
 .then(() => {
   console.log("Connected to MongoDB");
 })

 .catch((error) => {
   console.log("MongoDB connection error:", error);
 });


app.get('/', (req, res) => {
 res.send('Server is running!');
});

app.get('/students', async (req, res) => {
 const students = await Student.find();
 res.json(students);
});

app.post('/students', async (req, res) => {
 const { name, age, course } = req.body;
 const newStudent = new Student({
   name: name,
   age: age,
   course: course
 });

 await newStudent.save();
 res.json('Saved!');
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




app.listen(5000, () => {
 console.log('Server is running on port 5000');
});