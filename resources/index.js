// Container for projects list - Wrapper for tasks list
const container = document.querySelector('.container');
const wrapper = document.querySelector('.project');

const addBtn = document.querySelector('#add-project');
addBtn.addEventListener('click', addProject);

// Project object (not factory function)
function Project(name, tasks = []) {
    this.name = name;
    this.tasks = tasks;
    this.addTask = function (taskName, taskDate) {
        this.tasks.push({ taskName, taskDate, isDone: false });
        this.tasks.sort((prev, next) => prev.taskDate > next.taskDate ? 1 : -1)
    }
}

// Projects storage
let projects = [];

if (localStorage.getItem('storedProjects') !== null) {
    const savedProjects = JSON.parse(localStorage.getItem('storedProjects'));
    savedProjects.forEach(element => {
        projects.push(new Project(element.name, element.tasks));
    });
} else {
    const example = new Project("Example 1");
    projects.push(example);
    example.addTask("Task2", "2020-01-01");
    example.addTask("Task1", "2019-01-01");
    example.addTask("Task3", "2021-01-01");
    example.tasks[1].isDone = true;
}


function initialDisplay() {
    clearContent(container, 'li');

    projects.forEach(project => {
        const modelElement = document.createElement('li');
        modelElement.textContent = project.name;
        container.appendChild(modelElement);
        modelElement.addEventListener('click', (e) => {
            editProject(e.target.textContent);
        });
    });
};
initialDisplay();

function addProject() {
    const form = document.createElement('form');
    const newInput = document.createElement('input');
    newInput.setAttribute('name', 'projName');

    const validBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');
    validBtn.setAttribute('type', 'submit');
    cancelBtn.setAttribute('type', 'reset');
    validBtn.textContent = "V";
    cancelBtn.textContent = "X";

    form.appendChild(newInput);
    form.appendChild(validBtn);
    form.appendChild(cancelBtn);
    container.appendChild(form);

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (newInput.value) {
            projects.push(new Project(newInput.value));
            saveProjects();
            let newProject = document.createElement('li');
            container.appendChild(newProject);
            newProject.textContent = newInput.value;
            newProject.classList.add(`pro-${projects.length}`); // check utility
            newProject.addEventListener('click', () => editProject(form.projName.value));
            container.removeChild(form);
            editProject(newInput.value);
        }
    });

    cancelBtn.addEventListener('click', () => {
        container.removeChild(form);
    })
}


function editProject(projectName) {
    // Clear previous project field
    clearContent(wrapper);
    document.querySelector('.color-code').classList.add('unhide');

    const currentProj = projects.find(project => project.name == projectName);
    // Project field
    const title = document.createElement('input');
    title.value = projectName;

    const validate = document.createElement('button');
    validate.classList.add('save');
    validate.textContent = "Save";
    validate.addEventListener('click', () => {
        currentProj.name = title.value;
        document.querySelector('.color-code').classList.remove('unhide');
        clearContent(wrapper);
        saveProjects();
        initialDisplay();
    });

    const remove = document.createElement('button');
    remove.classList.add('del');
    remove.textContent = "Erase Project";
    remove.addEventListener('click', () => {
        projects.splice(projects.findIndex(project => project.name === projectName), 1);
        clearContent(wrapper);
        document.querySelector('.color-code').classList.remove('unhide');
        initialDisplay();
        saveProjects();
    });

    wrapper.appendChild(title);
    wrapper.appendChild(validate);
    wrapper.appendChild(remove);

    // Tasks field
    const taskList = document.createElement('ul');
    taskList.className = "tasks";

    // Display tasks
    for (let i of currentProj.tasks) {
        const newTask = document.createElement('li');
        const nameEl = document.createElement('span');
        newTask.appendChild(nameEl);
        nameEl.textContent = `${i.taskName} - ${i.taskDate}`;
        newTask.className = (i.isDone) ? "" : "undone";
        newTask.setAttribute('title', (i.isDone) ? "Click to mark as Pending.." : "Click to mark as Done");

        taskList.appendChild(newTask);

        newTask.addEventListener('click', (e) => {
            let target, duo;
            if (e.target.tagName === 'SPAN') {
                duo = e.target.textContent.split(' - ');
                target = e.target.parentElement;
            } else {
                duo = e.target.querySelector('span').textContent.split(' - ');
                target = e.target;
            }
            const currentTask = currentProj.tasks.find(task => {
                return task.taskName == duo[0] && task.taskDate == duo[1];
            });
            target.classList.toggle('undone');
            target.classList.toggle('done');
            currentTask.isDone = !currentTask.isDone;
            newTask.setAttribute('title', (i.isDone) ? "Click to mark as Pending.." : "Click to mark as Done");
        });
        newTask.addEventListener('mouseenter', (e) => {
            const duo = e.target.querySelector('span').textContent.split(' - ');
            const del = document.createElement('button');
            del.textContent = "Delete Task";
            newTask.appendChild(del);

            del.addEventListener('click', e => {
                e.stopPropagation();
                currentProj.tasks.splice(currentProj.tasks.findIndex(task => {
                    return task.taskName == duo[0] && task.taskDate == duo[1];
                }), 1);
                editProject(projectName);
            })
        });
        newTask.addEventListener('mouseleave', (e) => {
            const del = e.target.querySelectorAll('button');
            del.forEach(btn => btn.remove());
        });
    }

    // Form area ** Important to prevent page from realoading
    const form = document.createElement('form');
    const mainField = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = "Task form";
    mainField.appendChild(legend);

    const nameField = document.createElement('p');
    const nameLbl = document.createElement('label');
    nameLbl.textContent = "TASK NAME";
    const name = document.createElement('input');
    name.setAttribute('type', 'text');
    name.setAttribute('minlength', '2');
    name.setAttribute('required', '');

    const dateField = document.createElement('p');
    const dateLbl = document.createElement('label');
    dateLbl.textContent = "DUE DATE";
    const date = document.createElement('input');
    date.setAttribute('type', 'date');
    date.setAttribute('required', '');

    nameField.appendChild(nameLbl); nameField.appendChild(name);
    dateField.appendChild(dateLbl); dateField.appendChild(date);
    mainField.appendChild(nameField);
    mainField.appendChild(dateField);
    form.appendChild(mainField);

    // Input process
    name.addEventListener('input', () => {
        name.setCustomValidity('');
        name.checkValidity('');
    });
    name.addEventListener('invalid', () => {
        if (name.value == '') {
            name.setCustomValidity('Write a task name');
        } else {
            name.setCustomValidity('Task should be at least 2 charachters long');
        }
    });

    const btn = document.createElement('button');
    btn.textContent = "Submit task";
    btn.setAttribute('type', 'submit');

    // Submit process
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (name.validity.valid && date.validity.valid) {
            submitTask(name.value, date.value, projectName);
        }
    });

    mainField.appendChild(btn);

    wrapper.appendChild(taskList);
    wrapper.appendChild(form);
}

function saveProjects() {
    localStorage.setItem('storedProjects', JSON.stringify(projects));
}

function submitTask(taskName, taskDate, projectName) {
    const name = taskName.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    const currentProj = projects.find(project => project.name === projectName)
    currentProj.addTask(name, taskDate);
    editProject(projectName);
}

function clearContent(parent, children = '*') {
    const targets = parent.querySelectorAll(children);
    targets.forEach(child => child.remove());
}