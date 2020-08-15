import React, { Component } from "react";

import "./App.css";
import Stage from "./components/Stage";

export const NUM_STAGES = 4;
export const STAGE_NAMES = ["Backlog", "To Do", "Ongoing", "Done"];
export const SELECTED_TASK_COLOR = "rgb(16, 107, 163)";

class App extends Component {
  constructor(props) {
    super(props);
    const newState = STAGE_NAMES.reduce((acc,curr) => {
      const items = JSON.parse(localStorage.getItem(curr));
      acc[curr] = items || [];
      return acc;
    }, {});
    this.state = {...newState};
    this.addTaskTo = this.addTaskTo.bind(this);
    this.removeTaskFrom = this.removeTaskFrom.bind(this);
    this.moveTask = this.moveTask.bind(this);
  }

  addTaskTo(section, taskName) {
    const newTask = {
      id: Math.random(),
      name: taskName
    };
    const newSelectedSection = [...this.state[section], newTask];
    localStorage.setItem(section, JSON.stringify(newSelectedSection));
    this.setState({...this.state, [section]: newSelectedSection });
  }

  removeTaskFrom(section, task_id) {
    const selectedSection = this.state[section];
    let newSelectedSection = selectedSection.filter(item => item.id !== task_id);
    localStorage.setItem(section, JSON.stringify(newSelectedSection));
    this.setState({...this.state, [section]: newSelectedSection });
  }

  moveTask(i, direction, task) {
    const section = STAGE_NAMES[i];
    let nextSection;
    if (direction === 'forward') {
      nextSection = STAGE_NAMES[i + 1]
    } else {
      nextSection = STAGE_NAMES[i - 1];
    }
    const currentSection = this.state[section].filter(item => item.id !== task.id);
    const targetSection = [...this.state[nextSection], task];
    localStorage.setItem(section, JSON.stringify(currentSection));
    localStorage.setItem(nextSection, JSON.stringify(targetSection));
    this.setState({...this.state, [section]: currentSection, [nextSection]: targetSection });
  }

  render() {
    return (
      <div className="App">
        <h2>Task board | Increase your productivity</h2>
        <div
          style={{
            display: "flex",
            minHeight: '100px'
          }}
        >
          {
            STAGE_NAMES.map((name, i) => <Stage stageId={i} moveTask={this.moveTask} addTaskTo={this.addTaskTo} removeTaskFrom={this.removeTaskFrom} tasks={this.state[name]} key={name} name={name}/>)
          }
        </div>
      </div>
    );
  }
}

export default App;
