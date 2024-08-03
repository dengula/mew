import React from "react";
import { Component } from "react";
import "../styles/home.css";
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
    };
  }
  Api_url = "https://mongo-db-api-six.vercel.app/";

  componentDidMount() {
    this.refreshList();
  }
  async refreshList() {
    try {
      const response = await fetch(this.Api_url + "todoapp");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      this.setState({ notes: data });
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async addclick() {
    const description = document.getElementById("newdescription").value.trim();

    if (!description) {
      alert("Please enter a task description");
      return;
    }

    const data = {
      task: description,
    };

    try {
      const response = await fetch(this.Api_url + "todoapp/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const responseData = await response.json();
      console.log(responseData);
      alert("Task Added");
      this.refreshList();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    }
  }
  async deleteclick() {
    const newid = document.getElementById("newid").value.trim();

    if (!newid) {
      alert("Please enter an ID to Delete");
      return;
    }

    const data = {
      id: newid,
    };

    try {
      const response = await fetch(this.Api_url + "todoapp/delete/" + newid, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to Delete Task");
      }

      const responseData = await response.json();
      console.log(responseData);
      alert("Task Deleted");
      this.refreshList();
    } catch (error) {
      console.error("Error Deleting task:", error);
      alert("Failed to Delete task");
    }
  }
  render() {
    const { notes } = this.state;
    return (
      <div className="homebody">
        <h1>TodoAPP</h1>
        <input
          id="newdescription"
          type="text"
          placeholder="New Description"
          required
        />
        <br />
        <button id="addtask" onClick={() => this.addclick()}>
          Add Task
        </button>
        <br />
        <input
          id="newid"
          type="number"
          placeholder="ID to be Deleted"
          required
        />
        <br />
        <button id="addtask" onClick={() => this.deleteclick()}>
          Delete Task
        </button>
        <p className="notesbody">
          <b>ID</b>
          <b>Task</b>
        </p>
        {notes.map((note) => (
          <p key={note._id} className="notesbody">
            <b>{note.id}</b>
            <b>{note.task}</b>
          </p>
        ))}
      </div>
    );
  }
}
export default HomePage;
