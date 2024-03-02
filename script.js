let inp = document.getElementById("input-field");
let ul = document.getElementById("ul-field");
let btn = document.getElementById("btn-field");
let filterAllBtn = document.getElementById("filter-all");
let filterCompletedBtn = document.getElementById("filter-completed");
let filterActiveBtn = document.getElementById("filter-active");
let tasks = [];
let wishlistCount = 0;

// Function to handle drag and drop
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const draggedTask = tasks.find(task => task.id.toString() === taskId);
    const dropTarget = event.target.closest('li');
    
    // Check if the drop target is valid
    if (dropTarget) {
        const dropTargetId = dropTarget.dataset.id;
        const dropIndex = tasks.findIndex(task => task.id.toString() === dropTargetId);

        // Check if the drop target is different from the dragged task
        if (draggedTask && draggedTask.id.toString() !== dropTargetId) {
            // Remove dragged task from array
            tasks = tasks.filter(task => task.id.toString() !== taskId);

            // Insert dragged task at drop index
            tasks.splice(dropIndex, 0, draggedTask);

            renderTasks();
        }
    }
}

// Add event listeners for drag and drop
ul.addEventListener('dragstart', handleDragStart);
ul.addEventListener('dragover', handleDragOver);
ul.addEventListener('drop', handleDrop);

document.addEventListener('keydown', function(event) {
    if (event.key === '/') {
        inp.focus();
        event.preventDefault();
    } else if (event.keyCode === 13) {
        addItem();
    }
});

btn.addEventListener('click', addItem);
filterAllBtn.addEventListener('click', function() {
    filterTasks('all');
});
filterCompletedBtn.addEventListener('click', function() {
    filterTasks('completed');
});
filterActiveBtn.addEventListener('click', function() {
    filterTasks('active');
});

function addItem() {
    let val = inp.value.trim();
    if (val !== '') {
        let task = {
            id: Date.now(),
            text: val,
            completed: false,
            priority: 'medium',
            dueDate: null,
            subtasks: [],
            archived: false
        };
        tasks.push(task);
        renderTasks();
        inp.value = '';

        // Increment wishlist count
        wishlistCount++;
        document.getElementById('wishlist-count').textContent = wishlistCount;
    }
}

function removeItem(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function toggleCompleted(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    renderTasks();
}

function archiveTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.archived = true;
        }
        return task;
    });
    renderTasks();
}

function filterTasks(filterType) {
    let filteredTasks = [];
    if (filterType === 'all') {
        filteredTasks = tasks;
    } else if (filterType === 'completed') {
        filteredTasks = tasks.filter(task => task.completed && !task.archived);
    } else if (filterType === 'active') {
        filteredTasks = tasks.filter(task => !task.completed && !task.archived);
    }
    renderTasks(filteredTasks);
}

function renderTasks(tasksToRender = tasks) {
    ul.innerHTML = '';
    tasksToRender.forEach(task => {
        let li = document.createElement('li');
        li.dataset.id = task.id;
        li.dataset.archived = task.archived;
        li.classList.add(task.completed ? 'completed' : 'active');
        
        // Priority level
        li.classList.add(`priority-${task.priority}`);

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', function() {
            toggleCompleted(task.id);
        });
        li.appendChild(checkbox);

        let label = document.createElement('label');
        label.textContent = task.text;
        label.setAttribute('draggable', 'true');
        label.addEventListener('dragstart', handleDragStart);
        label.addEventListener('click', function() {
            let newText = prompt('Edit task:', task.text);
            if (newText !== null) {
                task.text = newText.trim();
                renderTasks();
            }
        });
        li.appendChild(label);

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            removeItem(task.id);
        });
        li.appendChild(deleteButton);

        // Archive button
        if (!task.completed && !task.archived) {
            let archiveButton = document.createElement('button');
            archiveButton.textContent = 'Archive';
            archiveButton.classList.add('archive-button');
            archiveButton.addEventListener('click', function() {
                archiveTask(task.id);
                renderTasks(); // Update the UI after archiving
            });
            li.appendChild(archiveButton);
        }

        ul.appendChild(li);
    });
}

// Countdown timer for days remaining until 2025
function countdownTimer() {
    const currentDate = new Date();
    const targetDate = new Date('2025-01-01');
    const daysRemaining = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
    document.getElementById('days-remaining').textContent = daysRemaining;
}

// Initial call to start the countdown timer
countdownTimer();
setInterval(countdownTimer, 86400000); // Update every 24 hours
