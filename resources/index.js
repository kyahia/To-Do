// Container for projects list - Wrapper for tasks list
const container = document.querySelector('.container');
const wrapper = document.querySelector('.project');

const addBtn = document.querySelector('#add-project');
addBtn.addEventListener('click', addProject);

const projects = [];

// Project object (not factory function)
function Project(name) {
    this.name = name;
    this.tasks = [];
    this.addTask = function (taskName, taskDate) {
        this.tasks.push({ taskName, taskDate, isDone: false });
    }
}


const modelProject = new Project("Example 1");
projects.push(modelProject);
modelProject.addTask("task1", "2020-01-01");
modelProject.addTask("task2", "2020-01-02");

const modelElement = document.createElement('li');
modelElement.classList.add('project1');
modelElement.textContent = modelProject.name;
container.appendChild(modelElement);
modelElement.addEventListener('click', (e) => editProject(e.target));

function addProject() {
    const newInput = document.createElement('input');
    const validBtn = document.createElement('button');
    validBtn.textContent = "V";
    container.appendChild(newInput);
    container.appendChild(validBtn);

    validBtn.addEventListener('click', () => {
        let newProject = document.createElement('li');
        newProject.textContent = newInput.value;
        projects.push(new Project(newInput.value));
        newProject.classList.add(`pro-${projects.length}`); // check utility
        container.appendChild(newProject);
        container.removeChild(newInput);
        container.removeChild(validBtn);
        newProject.addEventListener('click', (e) => editProject(e.target));
    });
}

function editProject(selectedProject) {
    // Clear previous project field
    const oldTasks = wrapper.querySelector('ul');
    const oldForm = wrapper.querySelector('form');
    const oldInput = wrapper.querySelector('input');
    const oldBtn = wrapper.querySelector('button');
    
    if (oldForm != undefined) {
        wrapper.removeChild(oldForm);
        wrapper.removeChild(oldTasks);
        wrapper.removeChild(oldInput);
        wrapper.removeChild(oldBtn);
    }

    // Project field
    const title = document.createElement('input');
    const validate = document.createElement('button');
    title.value = selectedProject.textContent;
    validate.textContent = "Done";
    validate.addEventListener('click', () => { selectedProject.textContent = title.value });

    wrapper.appendChild(title);
    wrapper.appendChild(validate);

    // Tasks field
    const taskList = document.createElement('ul');
    const currentProj = 
    projects[projects.findIndex(project => project.name == selectedProject.textContent)];

    // Display tasks
    for (let i of currentProj.tasks) {
        const newTask = document.createElement('li');
        newTask.textContent = `${i.taskName} - ${i.taskDate}`;
        newTask.addEventListener('click', (e)=>{
            const currentTask = currentProj.tasks
            [currentProj.tasks.findIndex(task => task.taskName == e.target.textContent.split(" - ")[0])]
            //console.log(currentTask);
            e.target.classList.toggle('undone');
            currentTask.isDone = !currentTask.isDone;
        });
        taskList.appendChild(newTask);
    }

    // Form area ** Important to prevent page from realoading
    const form = document.createElement('form');
    form.addEventListener('submit', (e) => {e.preventDefault();}) 
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

    nameField.appendChild(nameLbl);nameField.appendChild(name);
    dateField.appendChild(dateLbl);dateField.appendChild(date);
    mainField.appendChild(nameField);
    mainField.appendChild(dateField);
    form.appendChild(mainField);
    
    // Input process
    name.addEventListener('input', ()=>{
            name.setCustomValidity('');
            name.checkValidity('');
    });
    name.addEventListener('invalid', ()=>{
        if (name.value == ''){
            name.setCustomValidity('Write a task name');
        }else{
            name.setCustomValidity('Task should be at least 2 charachters long');
        }
    });

    const btn = document.createElement('button');
    btn.textContent = "Submit task";

    btn.addEventListener('click', () => {
        if(name.validity.valid && date.validity.valid){
            submitTask();
        }
    });

    function submitTask(){
        currentProj.addTask(name.value, date.value);
        const newTask = document.createElement('li');
        newTask.textContent = `${name.value} - ${date.value}`;
        newTask.addEventListener('click', (e)=>{
            console.log(currentProj);
            const currentTask = currentProj.tasks
            [currentProj.tasks.findIndex(task => task.taskName == e.target.textContent.split(" - ")[0])]
            console.log(currentTask);
            if(currentTask.isDone){
                e.target.classList.remove('done');
                e.target.classList.add('undone');
                currentTask.isDone = !currentTask.isDone;
            } else{
                e.target.classList.remove('undone');
                e.target.classList.add('done');
                currentTask.isDone = !currentTask.isDone;
            }
        });
        taskList.appendChild(newTask);
    }

    mainField.appendChild(btn);

    wrapper.appendChild(taskList);
    wrapper.appendChild(form);
}
