import {
  cleanup,
  fireEvent,
  getByTestId,
  getByText,
  queryByText,
  render,
} from "@testing-library/react";
import "jest-dom/extend-expect";
import React from "react";
import App, { NUM_STAGES, SELECTED_TASK_COLOR, STAGE_NAMES } from "./App";

let renderAppAndAddTasks;

const stageTestId = (stageId) => `stage-${stageId}`;

const taskNameToId = (name) => {
  return `task-${name.toLowerCase().split(" ").join("-")}`;
};

beforeEach(() => {
  renderAppAndAddTasks = () => {
    const testOps = render(<App />);
    const {
      getByTestId,
      queryAllByText,
      queryByPlaceholderText,
      queryByText,
    } = testOps;
    const addButton = queryAllByText("Add Task", { exact: false })[0];
    if (!addButton) {
      console.log(
        'Could not find the add task button, are you sure you put "Add Task" as the text for the add button?'
      );
      expect(addButton).toBeVisible();
    }

    fireEvent.click(addButton);
    const addInput = queryByPlaceholderText("Task Name", { exact: false });
    if (!addInput) {
      console.log(
        'Could not find the add task input, are you sure you put "Task Name" as the place holder for the input?'
      );
      expect(addInput).toBeVisible();
    }

    fireEvent.change(addInput, { target: { value: "test task 1" } });
    const addInputConfirm = queryByText("Confirm", { exact: false });
    if (!addInputConfirm) {
      console.log(
        'Could not find the confirm add task button, are you sure you put "Confirm" as the text on that button?'
      );
      expect(addInputConfirm).toBeVisible();
    }

    fireEvent.click(addInputConfirm);

    fireEvent.click(queryAllByText("Add Task", { exact: false })[0]);
    fireEvent.change(queryByPlaceholderText("Task Name", { exact: false }), {
      target: { value: "test task 2" },
    });
    fireEvent.click(queryByText("Confirm", { exact: false }));

    return testOps;
  };
});

afterEach(() => {
  cleanup();
});

test("Renders all columns with heading", () => {
  const { getByTestId } = render(<App />);
  for (let i = 0; i < NUM_STAGES; i++) {
    const col = getByTestId(stageTestId(i));
    expect(col).toBeTruthy();
    const heading = getByText(col, STAGE_NAMES[i]);
    expect(heading).toBeTruthy();
  }
});

test("Renders certain set of tasks", () => {
  const { container } = render(<App />);
  const col1 = getByTestId(container, stageTestId(0));
  const col2 = getByTestId(container, stageTestId(1));
  const col3 = getByTestId(container, stageTestId(2));

  const task1 = getByTestId(col1, taskNameToId("Task 1"));
  expect(task1).toBeTruthy();

  const task2 = getByTestId(col1, taskNameToId("Task 2"));
  expect(task2).toBeTruthy();

  const task3 = getByTestId(col2, taskNameToId("Task 3"));
  expect(task3).toBeTruthy();

  const task4 = getByTestId(col3, taskNameToId("Task 4"));
  expect(task4).toBeTruthy();
});

test("Adding Tasks", () => {
  const { getByTestId } = renderAppAndAddTasks();

  const task1 = getByTestId(taskNameToId("test task 1"));
  const task2 = getByTestId(taskNameToId("test task 2"));
  const firstStage = getByTestId(stageTestId(0));
  expect(firstStage).toContainElement(task1);
  expect(firstStage).toContainElement(task2);
});

test("Selecting and Deselecting Tasks", () => {
  const { getByTestId, queryByTestId } = renderAppAndAddTasks();
  const firstStage = getByTestId(stageTestId(0));
  let task1 = getByTestId(taskNameToId("test task 1"));
  fireEvent.click(task1);

  let style = window.getComputedStyle(task1);
  expect(style.backgroundColor).toBe(SELECTED_TASK_COLOR);

  task1 = getByTestId(taskNameToId("test task 1"));
  fireEvent.click(task1);

  style = window.getComputedStyle(task1);
  expect(style.backgroundColor).not.toBe(SELECTED_TASK_COLOR);
});

test("Deleting Tasks", () => {
  const { getByTestId, queryByTestId } = renderAppAndAddTasks();
  const firstStage = getByTestId(stageTestId(0));
  const task1 = getByTestId(taskNameToId("test task 1"));
  const task2 = getByTestId(taskNameToId("test task 2"));
  fireEvent.click(task1);
  let deleteButton = getByText(firstStage, "Delete", { exact: false });
  fireEvent.click(deleteButton);
  expect(firstStage).not.toContainElement(task1);

  fireEvent.click(task2);
  deleteButton = getByText(firstStage, "Delete", { exact: false });
  fireEvent.click(deleteButton);
  expect(firstStage).not.toContainElement(task2);
});

test("Moving Tasks", () => {
  const { getByTestId, queryByTestId, container } = renderAppAndAddTasks();
  const firstStage = getByTestId(stageTestId(0));
  const secondStage = getByTestId(stageTestId(1));
  const thirdStage = getByTestId(stageTestId(2));
  let task1 = getByTestId(taskNameToId("test task 1"));
  fireEvent.click(task1);
  let moveLeftButton = queryByText(firstStage, "Backward", { exact: false });
  expect(moveLeftButton).toBeNull();
  let moveRightButton = queryByText(firstStage, "Forward", { exact: false });
  fireEvent.click(moveRightButton);
  task1 = getByTestId(taskNameToId("test task 1"));

  expect(firstStage).not.toContainElement(task1);
  expect(secondStage).toContainElement(task1);

  fireEvent.click(task1);
  moveRightButton = queryByText(secondStage, "Forward", { exact: false });
  fireEvent.click(moveRightButton);
  task1 = getByTestId(taskNameToId("test task 1"));
  expect(secondStage).not.toContainElement(task1);
  expect(thirdStage).toContainElement(task1);

  fireEvent.click(task1);
  moveLeftButton = queryByText(thirdStage, "Backward", { exact: false });
  fireEvent.click(moveLeftButton);
  task1 = getByTestId(taskNameToId("test task 1"));
  expect(secondStage).toContainElement(task1);
  expect(thirdStage).not.toContainElement(task1);
});
