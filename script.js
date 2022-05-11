"use strict";

const D = document;
const B = document.body;

const formatDate = function (date) {
    let d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2)  day = "0" + day;
    return [year, month, day].join("-");
}

const today = () => new Date();
const tomorrow = () => new Date(new Date().setTime(new Date().getTime() + (24 * 60 * 60 * 1000)));

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

    // ----- MODEL -----

    remove () {
        let thisTask = this;
        let thisIndex = this.parent.tasks.findIndex(task => {
            return task === thisTask;
        });
        this.parent.remove(thisIndex);
    }

    // ----- VIEW -----

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

let inputDateDue = D.createElement("input");
inputDateDue.type = "date";
inputDateDue.value = formatDate(tomorrow());
inputDateDue.min = formatDate(today());

let buttonAddNewTask = D.createElement("button");
buttonAddNewTask.type = "button"; // so form doesn't get submitted
buttonAddNewTask.textContent = "Add Task";
buttonAddNewTask.addEventListener("click", () => {
    let content = inputNewTaskContent.value;
    let dateDue = new Date(inputDateDue.value);
    toDoList.add(content, today(), dateDue);
    inputNewTaskContent.value = "";
    inputDateDue.value = formatDate(tomorrow());
});

formAddNewTask.append(inputNewTaskContent, inputDateDue, buttonAddNewTask);

B.appendChild(formAddNewTask);
