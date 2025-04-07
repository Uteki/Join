const fullSum = document.querySelectorAll(".summary-statistics-element");
const upDate = document.getElementsByClassName("summary-urgent-container-right")[0];

let sumToDo = document.getElementsByClassName("summary-num")[0];
let sumDone = document.getElementsByClassName("summary-num")[1];
let sumUrgent = document.getElementsByClassName("summary-num")[2];
let sumInBoard = document.getElementsByClassName("summary-num")[3];
let sumInProg = document.getElementsByClassName("summary-num")[4];
let sumFeed = document.getElementsByClassName("summary-num")[5];

async function summarize() {
    await init();

    fullSum.forEach((item) => {
        item.onclick = function() {
            window.location.href = "./board.html";
        };
    })

    taskScanner();
}

function taskScanner() {
    let sumBoard = 0;

    sumToDo.innerText = taskList[0].tasks.length? taskList[0].tasks.length : 0;
    sumDone.innerText = taskList[3].tasks.length? taskList[3].tasks.length : 0;
    sumInProg.innerText = taskList[1].tasks.length? taskList[1].tasks.length : 0;
    sumFeed.innerText = taskList[2].tasks.length? taskList[2].tasks.length : 0;

    for (let i = 0; i < taskList.length; i++) {
        sumBoard += taskList[i].tasks.length;
    } sumInBoard.innerText = sumBoard;

    urgScanner();
}

function urgScanner() {
    let checker = true;
    let num = 0;
    let deadline;

    for (let i = 0; i < taskList.length; i++) {
        for (let j = 0; j < taskList[i].tasks.length; j++) {
            if (taskList[i].tasks[j].priority === "urgent") num++;

            if (new Date(taskList[i].tasks[j].dueDate) < deadline || checker === true) {
                deadline = new Date(taskList[i].tasks[j].dueDate); checker = false;
            }
        }
    } sumUrgent.innerText = num || 0;
    if (!deadline) { return upDate.firstElementChild.innerText = "No Deadline" } changeFormat(deadline);
}

function changeFormat(date) {
    upDate.firstElementChild.innerText = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}