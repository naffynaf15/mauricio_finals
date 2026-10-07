import './App.css'
import { useEffect, useState } from 'react';
import axios from "axios";

function App() {
 const [name, setName] = useState("");
 const [course, setCourse] = useState("");
 const [age, setAge] = useState("");
 const [students, setStudents] = useState([]);
const [id, setId] = useState([]);
 useEffect(() => {
   axios
     .get("http://localhost:5000/students")
     .then((response) => {
       setStudents(response.data);
     });
 }, []);
 const saveStudent = (event) => {
   event.preventDefault();
   axios
     .post("http://localhost:5000/students", {
       name: name,
       course: course,
       age: age
     })
     .then(() => {
       axios
         .get("http://localhost:5000/students")
         .then((response) => {
           setStudents(response.data);
         });
         
       setName("");
       setCourse("");
       setAge("");
     });
 };
 const deleteStudent = (id) => {
   axios
     .delete(`http://localhost:5000/students/${id}`).then(() => { 
       axios
         .get("http://localhost:5000/students")
         .then((response) => {
           setStudents(response.data);
         });

     });
 };
 const updateStudent = (event) => {
   axios
     .put(`http://localhost:5000/students/${id}`, {
       name: name,
       course: course,
       age: age
     })
     .then(() => {
       axios
         .get("http://localhost:5000/students")
         .then((response) => {
           setStudents(response.data);
         });
         
       setName("");
       setCourse("");
       setAge("");
     })
 };
 
 return (
    <div>
      <h1>Student Management System</h1>
        <h2>Students</h2>
            {students.map((student) => (
    <div key={student._id}>
    <p>Name: {student.name}</p>
    <p>Course: {student.course}</p>
    <p>Age: {student.age}</p>

    <button onClick={() => deleteStudent(student._id)}>Delete</button>

    <button onClick={() =>{
      setId(student._id);
      setName(student.name);
      setCourse(student.course);
      setAge(student.age);}}>Update</button>
        </div>
            ))}
    <div>
        <form onSubmit={saveStudent}>
  <div>
    <input
      type="text"
      placeholder="name"
      value={name}
      onChange={(event) => setName(event.target.value)}/>
  </div>
    <div>
      <input
          type="text"
          placeholder="course"
          value={course}
          onChange={(event) => setCourse(event.target.value)}/>
  </div>
    <div>
      <input
        type="text"
        placeholder="age"
        value={age}
        onChange={(event) => setAge(event.target.value)}/>
    </div>
  <div>
      <button className="submit-btn"type="submit">save</button>
      </div>
  </form>
  </div>
    </div>
          );
          }
export default App;