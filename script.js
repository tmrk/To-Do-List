"use strict";

const D = document;
const B = document.body;

let listCount = 0;

class ToDoList {

    constructor (name, task, dateCreated) {
        listCount++;
        this.name = name || "To-Do-List" + numberOfLists;
        this.tasks = [];
        this.dateCreated = dateCreated;
        this.constructView();
        if (task) this.add(task);
    }

    // ----- MODEL -----

    add (content, dateCreated = new Date(), dateDue) {
        if (content) {
            let newTask = new Task(content, dateCreated, dateDue, this);
            this.tasks.push(newTask);
            this.addView(newTask);
            console.log("Added new task: " + content);
        } else console.error("No task specified");
    }

    remove (taskIndex = -1) {
        if (taskIndex == -1) console.error("No task specified");
        else if (taskIndex >= 0 && taskIndex <= this.tasks.length - 1) {
            this.removeView(this.tasks[taskIndex]);
            this.tasks.splice(taskIndex, 1);
            console.log("Task removed from index " + taskIndex);
        } else console.error("No task at the specified index " + taskIndex);
    }

    // Returns an array of tasks that include the searchterm
    search (searchTerm) {
        if (searchTerm) {
            return this.tasks.filter(function (task) {
              return task.content.includes(searchTerm);
            })
        } else console.error("No search term specified");
    }

    // ----- VIEW -----

    constructView () {
        this.el = D.createElement("ul");
        this.el.id = this.name;
        B.appendChild(this.el);
    }

    addView (task) {
        this.el.appendChild(task.el);
    }

    removeView (task) {
        this.el.removeChild(task.el);
    }

}

class Task {

    constructor (content, dateCreated, dateDue, parent) {
        this.content = content;
        this.dateCreated = dateCreated;
        this.dateDue = dateDue;
        this.parent = parent;

        this.constructView ();
    }

    remove () {
        let thisTask = this;
        let thisIndex = this.parent.tasks.findIndex(task => {
            return task === thisTask;
        });
        this.parent.remove(thisIndex);
    }

    constructView () {
        this.el = D.createElement("li");
        this.el.textContent = this.content;
        this.el.dataset.dateCreated = this.dateCreated.getTime(); // milliseconds
        if (this.dateDue) this.el.dataset.dateDue = this.dateDue.getTime(); // milliseconds

        let buttonRemove = D.createElement("span");
        buttonRemove.classList.add("remove");
        buttonRemove.textContent = "X";
        buttonRemove.addEventListener("click", () => this.remove());

        this.el.appendChild(buttonRemove);
    }

}

// Create a new To Do List
let toDoList = new ToDoList("myList");

// Add some test data
toDoList.add("hej");
toDoList.add("foo");
toDoList.add("bar");
toDoList.add("bar2");


// ----- CONTROLLER -----

let formAddNewTask = D.createElement("form");
let inputNewTaskContent = D.createElement("input");
let buttonAddNewTask = D.createElement("button");
buttonAddNewTask.type = "button"; // so form doesn't get submitted
buttonAddNewTask.textContent = "Add Task";
buttonAddNewTask.addEventListener("click", () => {
  toDoList.add(inputNewTaskContent.value);
  inputNewTaskContent.value = "";
});
formAddNewTask.appendChild(inputNewTaskContent);
formAddNewTask.appendChild(buttonAddNewTask);

B.appendChild(formAddNewTask);
