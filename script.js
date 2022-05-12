"use strict";

const D = document;
const B = document.body;

const FormatDate = function (date) {
    let d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2)  day = "0" + day;
    return [year, month, day].join("-");
}

const Today = () => new Date();
const Tomorrow = () => new Date(new Date().setTime(new Date().getTime() + (24 * 60 * 60 * 1000)));

let listCount = 0;

class ToDoList {

    constructor (name, task, dateCreated = new Date()) {
        listCount++;
        this.name = name || "To-Do-List" + listCount;
        this.tasks = [];
        this.dateCreated = dateCreated;
        this.constructView();
        if (task) this.add(task);
    }

    add (content, dateCreated, dateDue) {        
        if (content) {
            if (Array.isArray(content)) content.forEach(task => { this.add(task) });
            else {
                let newTask;
                if (content instanceof Task) newTask = content;
                else newTask = new Task(content.toString(), dateCreated, dateDue);
                newTask.parent = this;
                this.tasks.push(newTask);
                this.addView(newTask);
                console.log("Added new task: '" + newTask.content + "' to " + this.name);
            } 
        } else console.error("No task specified");
    }

    remove (taskIndex = -1) {
        if (taskIndex == -1) console.error("No task specified");
        else if (taskIndex >= 0 && taskIndex <= this.tasks.length - 1) {
            this.removeView(this.tasks[taskIndex]);
            this.tasks.splice(taskIndex, 1);
            console.log("Task removed from index " + taskIndex + " of " + this.name);
        } else console.error("No task at the specified index " + taskIndex);
    }

    // Returns an array of tasks that include the searchterm
    search (searchTerm) {
        if (searchTerm) {
            this.tasks.forEach(task => {
                if (!task.content.includes(searchTerm)) task.el.style.display = "none";
                else task.el.style.display = "block";
            });
        } else this.tasks.forEach(task => { task.el.style.display = "block"; });;
    }

    constructView () {
        this.el = D.createElement("ul");
        this.el.id = this.name;

        this.control = D.createElement("form");
        let inputNewTaskContent = D.createElement("input");
        inputNewTaskContent.classList.add("taskname");
        inputNewTaskContent.placeholder = "My new task...";
        
        let labelDateDue = D.createElement("label");
        labelDateDue.textContent = "Deadline (optional)";
        labelDateDue.htmlFor = "dateDue";

        let inputDateDue = D.createElement("input");
        let today = Today();
        inputDateDue.type = "date";
        inputDateDue.name = "dateDue";
        inputDateDue.value = FormatDate(today);
        inputDateDue.min = FormatDate(today);

        let divDueDate = D.createElement("div");
        divDueDate.classList.add("duedate");
        divDueDate.append(labelDateDue, inputDateDue);
        
        let buttonAddNewTask = D.createElement("button");
        buttonAddNewTask.textContent = "Add Task";

        this.control.addEventListener("submit", (e) => {
            e.preventDefault();
            if (inputNewTaskContent.value) {
                let dateDue = inputDateDue.value > FormatDate(today) ? new Date(inputDateDue.value) : 0;
                let newTask = new Task(inputNewTaskContent.value, new Date(), dateDue);
                this.add(newTask);
                inputNewTaskContent.value = "";
                inputDateDue.value = FormatDate(today);
            } else console.error("No task specified");
        });

        let inputSearch = D.createElement("input");
        inputSearch.placeholder = "Search";
        inputSearch.addEventListener("input", () => {
            this.search(inputSearch.value);
        });

        this.divList = D.createElement("div");
        this.divList.id = this.name.replaceAll(" ", "")
        this.divList.classList.add("todolist");

        this.control.append(inputNewTaskContent, divDueDate, buttonAddNewTask);

        let divPlaceholder = D.createElement("div");
        divPlaceholder.textContent = "Hooray, nothing to do!"

        let divSearch = D.createElement("div");
        divSearch.append(inputSearch, divPlaceholder);
        divSearch.classList.add("search");

        let headerList = D.createElement("header");
        headerList.append(this.control, divSearch);
        
        this.divList.append(headerList, this.el);

        divContainer.appendChild(this.divList);
    }

    addView (task) {
        this.el.appendChild(task.el);
        this.divList.classList.remove("empty");
    }

    removeView (task) {
        this.el.removeChild(task.el);
        if (this.tasks.length == 1) this.divList.classList.add("empty");
    }

}

class Task {

    constructor (content, dateCreated = new Date(), dateDue, parent) {
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

        let spanContent = D.createElement("span");
        spanContent.classList.add("content");
        spanContent.textContent = this.content;

        let spanDateDue = D.createElement("span");
        spanDateDue.classList.add("datedue");
        spanDateDue.textContent = this.dateDue ? "By: " + FormatDate(this.dateDue) : "";

        this.el.dataset.dateCreated = this.dateCreated.getTime(); // milliseconds
        if (this.dateDue) this.el.dataset.dateDue = this.dateDue.getTime(); // milliseconds
        let buttonRemove = D.createElement("span");
        buttonRemove.classList.add("remove");
        buttonRemove.title = "Delete this task";
        buttonRemove.textContent = "X";
        buttonRemove.addEventListener("click", () => this.remove());

        this.el.append(spanContent, spanDateDue, buttonRemove);
    }

}

// ----- BUILD PAGE -----

let header = D.createElement("header");
let h1Title = D.createElement("h1");
h1Title.textContent = "To Do List"
header.appendChild(h1Title);

let divContainer = D.createElement("div");
divContainer.id = "container";

let footer = D.createElement("footer");

B.append(header, divContainer, footer);


// Create a new To Do List
let toDoList = new ToDoList("myList");

// Add some test data
toDoList.add("hej");
toDoList.add("foo");
toDoList.add("bar");
toDoList.add("bar2");