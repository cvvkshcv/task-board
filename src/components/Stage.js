import React, { useState } from "react";

import Task from "./Task";
import { Card, Button, InputGroup, Collapse } from "@blueprintjs/core";

const Stage = ({ name, stageId, tasks, removeTaskFrom, addTaskTo, moveTask }) => {
  const stageTestId = `stage-${stageId}`;
  const [taskValue, setTaskValue] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTask, setActiveTask] = useState(false);

  const addNewTask = () => {
    setShowAddTask(true);
    console.log(name);
  };

  const confirm = () => {
    if (taskValue.length > 0) {
      setShowAddTask(false);
      addTaskTo(name, taskValue)
      setTaskValue('');
    }
  };

  const handleTagChange = (e) => {
    setTaskValue(e.target.value)
  };

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      confirm();
    }
  }

  return (
    <Card 
      style={{flex: 1, backgroundColor: '#f1f1f1', borderRadius: '5px', margin: '0 10px', boxShadow: '0px 2px 8px #ccc'}}
      data-testid={stageTestId}
    >
      <h3>{name}</h3>
      {
        activeTask && (
          <div>
            { (name !== 'Backlog') ? <Button intent="primary" icon={'chevron-left'} onClick={() => {
                moveTask(stageId, 'back', activeTask);
                setActiveTask(null)
            }} style={{marginRight: '10px'}}>Back</Button> : null }
            { (name !== 'Done') ? <Button intent="primary" icon={'chevron-right'} onClick={() => {
              moveTask(stageId, 'forward', activeTask);
              setActiveTask(null);
            }} style={{marginRight: '10px'}}>Forward</Button> : null }
            <Button intent="danger" onClick={() => {
              setActiveTask(null);
              removeTaskFrom(name, activeTask.id);
            }}>Delete</Button>
          </div>
        )
      }
      {
        tasks.map(task => {
          return (
            <div key={name + task.name} onClick={() => {
              setActiveTask(task);
              console.log(activeTask)
            }} className={(activeTask && task.id === activeTask.id) ? 'active' : ''} >
              <Task name={task.name} />
            </div>
          )
      })
      }
      {
        showAddTask && <div style={{marginTop: '20px'}}>
          <InputGroup
            small={true}
            value={taskValue}
            placeholder="Find tags"
            onChange={handleTagChange}
            onKeyDown={_handleKeyDown}
            rightElement={<Button intent="success" onClick={confirm}>Confirm</Button>}
          />
        </div>
      }
      { !showAddTask && <Button intent="success" style={{marginTop: '20px'}} onClick={addNewTask}>Add Task</Button> }
    </Card>
  );
};

export default Stage;
