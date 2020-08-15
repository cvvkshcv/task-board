import React from "react";
import { Card } from "@blueprintjs/core";

const taskNameToId = name => {
  return `task-${name
    .toLowerCase()
    .split(" ")
    .join("-")}`;
};

const Task = ({ name }) => {

  return (
    <div data-testid={taskNameToId(name)}>
      <Card style={{cursor: 'pointer', padding: '10px'}}>
        {name}
      </Card>
    </div>
  );
};

export default Task;
