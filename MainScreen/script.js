const addTasksBtn = document.getElementById('addTasks');
const removeTasksBtn = document.getElementById('removeTasks');
const showInDoneBtn = document.getElementById('showInDone');
const userPDBtn = document.getElementById('userPD');
const getFromLocalBtn = document.getElementById('getFromLocal');
const saveToServerBtn = document.getElementById('saveToServer');
const alphOrderBtn = document.getElementById('alphOrder');
const ulToDo = document.getElementById('ulToDo');
const ulDone = document.getElementById('ulDone');
const setImportance = true;

function createTask(taskTitle){
    const newLiItem = document.createElement("li");
    const taskDiv = document.createElement("div");
    const removeBtn = document.createElement("button");
    const setReminderBtn = document.createElement("button");
    const importanceLvl = window.prompt(`Type the importance level of your task: 
        1 - Very important
        2 - Important
        3 - Not that important
        4 - Not important`);
    const number = Number(importanceLvl)

    taskDiv.classList.add('task');
    taskDiv.textContent = taskTitle;

    removeBtn.textContent = `Remove Task`;
    removeBtn.addEventListener('click', function(){
        ulToDo.removeChild(newLiItem);
        saveTasksToLocalStorage();
    });

    setReminderBtn.textContent = `Set Reminder`;
    setReminderBtn.addEventListener('click', function(){
        const delayTime = window.prompt('Type the ammount of delay, please (in seconds): ');
        const delayTIME = Number(delayTime);

        function setDelay(){
            return new Promise((resolve, reject) => {
                if (!isNaN(delayTIME) && delayTIME > 0){
                    setTimeout(() => {
                        resolve(alert(`Reminder: Time is up! It's been ${delayTIME} seconds!`))
                    }, delayTIME * 1000)
                }else{
                    reject(`Please, enter a valid time greater than 0! (in seconds)`);
                }
            })
        }

        setDelay()
                .then((message) => {
                console.log(message)
            })

                .catch((error) => {
                console.log(error)
            })
    });

    //Importance Level (Tweks to be done in: Get From Local Button)
    if (setImportance){
        if (number == 1){
            taskDiv.style.backgroundColor = `red`
        }else if (number == 2){
            taskDiv.style.backgroundColor = `yellow`
        }else if (number == 3){
            taskDiv.style.backgroundColor = `cyan`
        }else if (number == 4){
            taskDiv.style.backgroundColor = `white`
        }else{
            alert('Inalid number, please, type a valid number');
        }
    }

    newLiItem.style.listStyleType = `none`;
    newLiItem.appendChild(taskDiv);
    taskDiv.appendChild(removeBtn);
    taskDiv.appendChild(setReminderBtn);
    ulToDo.appendChild(newLiItem);
}

addTasksBtn.addEventListener('click', function(){
    const removeTaskBtn = document.createElement("button")
    const newLiItem = document.createElement("li")
    const newTaskInput = document.createElement("input");
    removeTaskBtn.textContent = `Remove Task`
    newTaskInput.type = `text`;
    newTaskInput.placeholder = ``

    ulToDo.appendChild(newTaskInput);
    newTaskInput.focus();

    //When Enter is pressed, the task is created
    newTaskInput.addEventListener('keydown', function(event){
        if (event.key === "Enter"){

            const inputValue = newTaskInput.value.trim();

            if (inputValue !== ""){
                createTask(inputValue)
                saveTasksToLocalStorage();
                newTaskInput.remove();
            }else{
                alert("Digite algo!")
                newTaskInput.focus();
            }
        }
    });

    //Removes the inline items
    removeTaskBtn.addEventListener('click', function(){
        if (ulToDo.querySelector('li')){
            ulToDo.removeChild(newLiItem);
            localStorage.removeItem(newLiItem);
        }else{
            alert('There are no items to remove');
        }
    });
});

removeTasksBtn.addEventListener('click', function () {
    if (ulToDo.children.length > 0) {
        while (ulToDo.firstChild) {
            ulToDo.removeChild(ulToDo.firstChild);
        }
        localStorage.removeItem('tasks');
    } else if(ulDone.children.length > 0){
        while (ulDone.firstChild){
            ulDone.removeChild(ulDone.firstChild);
        }
    }else{
        alert('No tasks to remove');
    }
});

showInDoneBtn.addEventListener('click', function(){
        function showTasks(){
            return new Promise((resolve, reject) => {
                const tasks = localStorage.getItem('tasks');
                if (tasks !== null){
                    resolve(JSON.parse(localStorage.getItem('tasks')));
                }else{
                    reject('No tasks key found');
                }
            });
        }

        showTasks()
            .then((tasks) => {
                tasks.forEach(task => {
                    console.log(task);
                });
            })

            .catch((error) => {console.log(error)})
});

saveToServerBtn.addEventListener('click', function(){
    
});

getFromLocalBtn.addEventListener('click', function(){
    function fetchTasks(){
        return new Promise((resolve, reject) => {
            const fetchedTasks = localStorage.getItem('tasks');
            if (fetchedTasks !== null){
                resolve(JSON.parse(fetchedTasks));
            }else{
                reject('No tasks key found');
            }
        })
    }

    fetchTasks()
        .then(tasks => {
            tasks.forEach((task) => {
                console.log(task);
                createTask(task);
            })
        })

        .catch((error) => {
                console.log(`Error: ${error}`);
            })
});

alphOrderBtn.addEventListener('click', function(){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const sortedTasks = tasks.sort((a, b) => a.localeCompare(b))
    ulToDo.innerHTML = "";
    sortedTasks.forEach(task => {
        createTask(task);
    })
});

function fetchUserProfileData(userID){
    return new Promise((resolve, reject) => {
        const users = [
            {
                id: 1,
                name: "Sinkerzin",
                occupation: "YouTuber"
            },

            {
                id: 2,
                name: "Pedro Igor",
                occupation: "Programmer"
            }
        ]

        const user = users.find(user => user.id === userID);

        if (user){
            resolve(user);
        }else{
            reject(`The user with id: ${userID} couldn't be found`);
        }
    })
}

userPDBtn.addEventListener('click', function(){
    const userID = 1;
    fetchUserProfileData(userID)

        .then((user) => {
            console.log(`User Data: `, user);
        })

        .catch((error) => {
            console.log(`Attention, Error: ${error}`);
        })
});

function saveTasksToLocalStorage(){
    const tasks = Array.from(ulToDo.querySelectorAll('li .task')).map(task => task.textContent
        .replace('Remove Task', '')
        .replace('Set Reminder', '')
        .trim())
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksTolocalStorage(){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.forEach(taskText => createTask(taskText));
}

//Modal Prototype
const dialog = document.getElementById('dialog');
const button = document.getElementById('button');
const closeBtn = document.getElementById('closeDialog');

button.addEventListener('click', function(){
    dialog.showModal();
});

closeBtn.addEventListener('click', function(){
    dialog.close();
});