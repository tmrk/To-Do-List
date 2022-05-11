"use strict";

const D = document;
const B = document.body;
let listCount = 0;

class ToDoList {

    constructor (name, task) {
        listCount++;
        this.name = name || "To-Do-List" + numberOfLists;
        this.tasks = [];
        this.viewConstruct();
        if (task) this.add(task);
    }

    add (content, dateAdded = new Date(), dateDue) {
        if (content) {
            let newTask = new Task(content, dateAdded, dateDue);
            this.tasks.push(newTask);
            this.viewAdd(newTask);
            console.log("Added new task: " + content);
        } else console.error("No task specified");
    }

    remove (taskIndex = -1) {
        if (taskIndex >= 0 && taskIndex <= this.tasks.length - 1) {
            this.tasks.splice(taskIndex, 1);
            console.log("Task removed from index " + taskIndex);
        } else console.error("No task specified or no task at the specified index");  
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

    viewConstruct () {
        this.el = D.createElement("ul");
        this.el.id = this.name;
        B.appendChild(this.el);
    }

    viewAdd (task) {
        let newTask = D.createElement("li");
        newTask.textContent = task.content;
        newTask.dataset.dateAdded = task.dateAdded.getTime(); // milliseconds
        if (task.dateDue) newTask.dataset.dateDue = task.dateDue.getTime(); // milliseconds
        this.el.appendChild(newTask);
    }

}

class Task {
    
    constructor (content, dateAdded, dateDue) {
        this.content = content;
        this.dateAdded = dateAdded;
        this.dateDue = dateDue;
    }

}

let toDoList = new ToDoList("myList");

toDoList.add("hej");
toDoList.add("foo");
toDoList.add("bar");
toDoList.add("bar2");

