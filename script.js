"use strict";

class ToDoList {

    constructor (task) {
        this.tasks = [];
        if (task) this.add(task);
    }

    add (content, dateAdded, dateDue) {
        
        if (content) {
            let newTask = new Task(content, dateAdded, dateDue);
            this.tasks.push(newTask);
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

}

class Task {
    
    constructor (content, dateAdded, dateDue) {
        this.content = content;
        this.dateAdded = dateAdded;
        this.dateDue = dateDue;
    }

}

let toDoList = new ToDoList;

toDoList.add("hej");
toDoList.add("foo");
toDoList.add("bar");
toDoList.add("bar2");
