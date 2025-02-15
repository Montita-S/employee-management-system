import "./App.css";
import React, { useState } from "react";
import Axios from "axios";
import { Form, Button } from "react-bootstrap";

function Employees() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(0);
  const [newWage, setNewWage] = useState(0);

  const [employeeList, setEmployeeList] = useState([]);

  const getEmployees = () => {
    Axios.get("http://localhost:3001/employees")
      .then((response) => {
        setEmployeeList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };

  const addEmployee = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/create", {
      name: name,
      age: age,
      country: country,
      position: position,
      wage: wage,
    })
      .then(() => {
        setEmployeeList([
          ...employeeList,
          {
            name: name,
            age: age,
            country: country,
            position: position,
            wage: wage,
          },
        ]);
        // Clear form after adding
        setName("");
        setAge(0);
        setCountry("");
        setPosition("");
        setWage(0);
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
      });
  };

  const updateEmployeeWage = (id) => {
    Axios.put("http://localhost:3001/update", { wage: newWage, id: id })
      .then((response) => {
        setEmployeeList(
          employeeList.map((val) => {
            return val.id === id
              ? { ...val, wage: newWage }
              : val;
          })
        );
      })
      .catch((error) => {
        console.error("Error updating wage:", error);
      });
  };

  const deleteEmployee = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        setEmployeeList(
          employeeList.filter((val) => val.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
  };
/*const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
  user: "montita",
  host: "localhost",
  password: "interface",
  database: "employeeSystem",
});

//--------------------------------------------------------------------------------------------
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        db.query(
            "INSERT INTO register (username, password) VALUES (?, ?)",
            [username, hash],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json({ message: 'User registered successfully', username });
            }
        );
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM register WHERE username = ?",
        [username],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (isMatch) {
                    return res.status(200).json({ message: 'Login successful', username });
                } else {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
            });
        }
    );
});


//-------------------------------------------------------------------------------------------
app.get("/employees", (req, res) => {
    db.query("SELECT * FROM employees", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const country = req.body.country;
  const position = req.body.position;
  const wage = req.body.wage;

  db.query(
    "INSERT INTO employees (name, age, country, position, wage) VALUES (?,?,?,?,?)",
    [name, age, country, position, wage],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.put("/update", (req, res) => {
  const id = req.body.id;
  const wage = req.body.wage;
  db.query(
    "UPDATE employees SET wage = ? WHERE id = ?",
    [wage, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
//----------------------------------------------------------------------------------------------------------------
app.listen(3001, () => {
    console.log("Yey, your server is running on port 3001");
});*/

  return (
    <div className="App container">
      <h1>Employees Information</h1>
      <div className="information">
        <Form onSubmit={addEmployee}>
          <Form.Group className="mb-3">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Enter name"
              onChange={(event) => setName(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Age:</Form.Label>
            <Form.Control
              type="number"
              value={age}
              placeholder="Enter age"
              onChange={(event) => setAge(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Country:</Form.Label>
            <Form.Control
              type="text"
              value={country}
              placeholder="Enter country"
              onChange={(event) => setCountry(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Position:</Form.Label>
            <Form.Control
              type="text"
              value={position}
              placeholder="Enter position"
              onChange={(event) => setPosition(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Wage:</Form.Label>
            <Form.Control
              type="number"
              value={wage}
              placeholder="Enter wage"
              onChange={(event) => setWage(event.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="btn btn-success">
            Add Employee
          </Button>
        </Form>
      </div>
      <hr />
      <div className="employees">
        <Button className="btn btn-primary" onClick={getEmployees}>
          Show Employees
        </Button>
        <br />
        <br />
        {employeeList.map((val) => (
          <div key={val.id} className="employee card">
            <div className="card-body text-left">
              <p className="card-text">Name: {val.name}</p>
              <p className="card-text">Age: {val.age}</p>
              <p className="card-text">Country: {val.country}</p>
              <p className="card-text">Position: {val.position}</p>
              <p className="card-text">Wage: {val.wage}</p>
              <div className="d-flex">
                <Form.Control
                  style={{ width: "300px" }}
                  type="number"
                  placeholder="Enter new wage"
                  onChange={(event) => setNewWage(event.target.value)}
                />
                <Button className="btn btn-warning" onClick={() => updateEmployeeWage(val.id)}>
                  Update
                </Button>
                <Button className="btn btn-danger" onClick={() => deleteEmployee(val.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Employees;
