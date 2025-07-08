let searchArea = document.querySelector('.search');
let addBtn = document.querySelector('.add-btn');
let taskList = document.querySelector('.task-list');
let progressBar = document.querySelector('.progress');
let taskNumber = document.querySelector('.number');

// Create task with all logic included
function createTaskElement(text, done = false) {
    let task = document.createElement("li");
    task.innerHTML = `
        <input type="checkbox" class="checkbox" ${done ? "checked" : ""}>
        <span class='span ${done ? "completed" : ""}'>${text}</span>
        <div class="task-button">
            <span class='edit-btn'><ion-icon name="pencil"></ion-icon></span>
            <span class='delete-btn'><ion-icon name="trash"></ion-icon></span>
        </div>
    `;

    const checkbox = task.querySelector('.checkbox');
    const editBtn = task.querySelector('.edit-btn');

    // Apply correct style to edit button based on done state
    if (done) {
        editBtn.style.opacity = '0.5';
        editBtn.style.pointerEvents = 'none';
    } else {
        editBtn.style.opacity = '1';
        editBtn.style.pointerEvents = 'auto';
    }

    // Checkbox toggle
    checkbox.addEventListener('change', function () {
        const ischecked = checkbox.checked;
        task.querySelector('.span').classList.toggle('completed', ischecked);
        editBtn.style.opacity = ischecked ? '0.5' : '1';
        editBtn.style.pointerEvents = ischecked ? 'none' : 'auto';
        updateProgress();
        saveToLocalStorage();
    });

    // Edit task
    editBtn.addEventListener('click', function () {
        if (!checkbox.checked) {
            searchArea.value = task.querySelector('span').textContent;
            task.remove();
            updateProgress();
            saveToLocalStorage();
        }
    });

    // Delete task
    task.querySelector('.delete-btn').addEventListener('click', function () {
        task.remove();
        updateProgress();
        saveToLocalStorage();
    });

    return task;
}

// Add new task
function addTask() {
    if (searchArea.value.trim() === "") return;

    const taskText = searchArea.value.trim();
    const task = createTaskElement(taskText);
    taskList.appendChild(task);

    searchArea.value = '';
    updateProgress();
    saveToLocalStorage();
}

// Save to localStorage
function saveToLocalStorage() {
    const tasks = [];
    const allTasks = taskList.querySelectorAll("li");

    allTasks.forEach(task => {
        const text = task.querySelector(".span").textContent;
        const done = task.querySelector(".checkbox").checked;
        tasks.push({ text, done });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load from localStorage on page load
function loadFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(taskData => {
        const task = createTaskElement(taskData.text, taskData.done);
        taskList.appendChild(task);
    });

    updateProgress();
}

// Update progress bar and numbers
function updateProgress() {
    let totalTask = taskList.children.length;
    let taskDone = taskList.querySelectorAll(".checkbox:checked").length;

    progressBar.style.width = totalTask ? `${(taskDone / totalTask) * 100}%` : '0%';
    taskNumber.innerHTML = `${taskDone} / ${totalTask}`;

    if (taskDone === totalTask && totalTask > 0) {
        showConfetti();
    }
}

// Confetti celebration
function showConfetti() {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

// Add task on button click or Enter key
addBtn.addEventListener('click', () => addTask());

searchArea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

// Load tasks on page load
loadFromLocalStorage();
