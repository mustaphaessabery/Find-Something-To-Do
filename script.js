const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const myBtn = document.getElementById('btn');
const themeIcon = document.querySelector("#imgMode");
let up = document.querySelector(".up");
const allBtn = document.getElementById('all');
const inProgressBtn = document.getElementById('in-progress');
const completedBtn = document.getElementById('completed');
let filterStatus = 'all';
let spanCounters = document.querySelectorAll(".counters");
let counterDiv = document.querySelector("#counter");
let counted = false;
// Scroll to Top Button

window.onscroll = function () {
    if (this.scrollY >= 300) {
        up.classList.add("show");
    } else {
        up.classList.remove("show");
    }
    if (!counted && window.scrollY + window.innerHeight >= counterDiv.offsetTop) {
        updateCounter();
        counted = true;
    }
};
up.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

// Load Saved Theme Mode

if (window.localStorage.getItem("imageSource")) {
    document.body.classList.add(window.localStorage.getItem("class"));
    themeIcon.src = window.localStorage.getItem("imageSource");
}

// Initial Load Functions

showTask();
updateCounter();

// Event Listeners

themeIcon.addEventListener("click", change);
myBtn.addEventListener("click", addTask);
listContainer.addEventListener("click", doTask, false);

// Filter Buttons

allBtn.addEventListener("click", function () {
    filterStatus = 'all';
    showTasks();
});
inProgressBtn.addEventListener("click", function () {
    filterStatus = 'in-progress';
    showTasks();
});
completedBtn.addEventListener("click", function () {
    filterStatus = 'completed';
    showTasks();
});

// Inline Editing on Double Click
listContainer.addEventListener('dblclick', function (e) {
    if (e.target.tagName === "LI") {
        const originalText = e.target.firstChild.textContent.trim();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.style.width = '80%';
        if (document.body.classList.contains("dark-mode")) input.style.color = "white";
        e.target.innerHTML = '';
        e.target.appendChild(input);
        input.focus();
        input.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') {
                const newText = input.value.trim();
                if (newText) {
                    e.target.innerHTML = newText;
                    const span = document.createElement('span');
                    span.innerHTML = "\u00d7";
                    e.target.appendChild(span);
                    saveData();
                    updateCounter();
                }
            }
        });
    }
});

// Add Task

function addTask() {
    if (inputBox.value.trim() === "") {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        let span = document.createElement('span');
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        listContainer.appendChild(li);
        saveData();
        updateCounter();
    }
    inputBox.value = '';
}

// do task (Done or Delete)

function doTask(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
    }
    saveData();
    updateCounter();
}

// Save Tasks to LocalStorage

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Load Tasks from LocalStorage

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

// Change Theme (Dark/Light)

function change() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        themeIcon.src = "images/sun.png";
        window.localStorage.setItem("class", "dark-mode");
        window.localStorage.setItem("imageSource", "images/sun.png");
    } else {
        themeIcon.src = "images/moon.png";
        window.localStorage.setItem("class", "white-mode");
        window.localStorage.setItem("imageSource", "images/moon.png");
    }
}

// Update Task Counter

function updateCounter() {
    const tasks = listContainer.getElementsByTagName('li');
    const total = tasks.length;
    let completed = 0;
    for (let task of tasks) {
        if (task.classList.contains('checked')) completed++;
    }
    const remaining = total - completed;
    startCount(total, remaining, completed);

}
// Start counting
function startCount(total, remaining, completed){
    spanCounters[0].textContent = 0;
    spanCounters[1].textContent = 0;
    spanCounters[2].textContent = 0;
    let count1 = setInterval(function(){
        if(spanCounters[0].textContent >= total){
            clearInterval(count1);
        } else{
            spanCounters[0].textContent++;
        }
    }, 100);
    let count2 = setInterval(function(){
        if(spanCounters[1].textContent >= completed){
            clearInterval(count2);
        } else{
            spanCounters[1].textContent++;
        }
    }, 100);
    let count3 = setInterval(function(){
        if(spanCounters[2].textContent >= remaining){
            clearInterval(count3);
        } else{
        spanCounters[2].textContent++;
        }
    }, 100);
} // like this
// Filter(all, completed, in-progress)
function showTasks() {
    const savedData = localStorage.getItem("data");
    if (!savedData) return;
    listContainer.innerHTML = savedData;
    const tasks = Array.from(listContainer.children);
    listContainer.innerHTML = '';
    tasks.forEach(function (task) {
        const taskStatus = task.classList.contains('checked') ? 'completed' : 'in-progress';
        if (filterStatus === 'all' || taskStatus === filterStatus) {
            listContainer.appendChild(task);
        }
    });
}
