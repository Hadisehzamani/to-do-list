var $ = document
var taskInput = $.querySelector('#myInput')
var addBtn = $.querySelector('.task-name button')
var doingUl = $.querySelector('.doingTask ul')
var completeList = $.querySelector('.doneList ul')
var todoArr = []

function addNewTodo(){
    var taskInputValue = taskInput.value.trim()
    var newTodoObj
    if(taskInputValue != ''){
        newTodoObj = {
            id: todoArr.length + 1,
            taskName: taskInputValue,
            complete: false
        }

        taskInput.value = ''

        todoArr.push(newTodoObj);
        setLocalStorage(todoArr)
        creatNewTaskElement(newTodoObj)
        taskInput.focus()
    }
    
}

function setLocalStorage(todolist){
    localStorage.setItem('todos', JSON.stringify(todolist))
}

function creatNewTaskElement(task) {
    var newLi;
    var newDiv;
    var newCheckbox;
    var newLabel;
    var newEditInput;
    var newIconDiv;
    var newEditIcon;
    var newSaveIcon;
    var newDeleteIcon;
  
    doingUl.innerHTML = '';
  
    todoArr.forEach(function (todo) {
      newLi = document.createElement('li');
      newDiv = document.createElement('div');
      newCheckbox = document.createElement('input');
      newLabel = document.createElement('label');
      newEditInput = document.createElement('input');
      newIconDiv = document.createElement('div');
      newEditIcon = document.createElement('i');
      newSaveIcon = document.createElement('i');
      newDeleteIcon = document.createElement('i');
  
      newCheckbox.type = 'checkbox';
      newEditInput.type = 'text';
      //newEditIcon.classList.add('editMode')
      newEditIcon.classList.add('fa-regular', 'fa-pen-to-square', 'edit');
      newSaveIcon.classList.add('fa-regular', 'fa-floppy-disk', 'save');
      newDeleteIcon.classList.add('fa-solid', 'fa-trash', 'delete');
      newLabel.innerHTML = todo.taskName;
      newLi.setAttribute('data-id', task.id);
  
      newDiv.append(newCheckbox);
      newDiv.append(newLabel);
      newDiv.append(newEditInput);
      newIconDiv.append(newSaveIcon);
      newIconDiv.append(newEditIcon);
      newIconDiv.append(newDeleteIcon);
      
      newLi.append(newDiv);
      newLi.append(newIconDiv);
      doingUl.append(newLi);
      
      newEditIcon.addEventListener('click', editTodo);
      newSaveIcon.addEventListener('click', editTodo);
      newDeleteIcon.addEventListener('click', function () {
        var listItem = this.parentElement.parentElement;
        var removeItem = listItem.querySelector('label').innerHTML;
        listItem.remove();
        let localStorageTodos = JSON.parse(localStorage.getItem('todos'));
        var updatedTasks = localStorageTodos.filter(function (todo) {
          return todo.taskName !== removeItem;
        });
        localStorage.setItem('todos', JSON.stringify(updatedTasks));
      });

      newCheckbox.addEventListener('change', function () {
        var listItem = this.parentElement.parentElement;
    
        if (this.checked) {
          completedtasks(listItem);
    
          todoArr.forEach(function (todo) {
            if (todo.id === task.id) {
              todo.complete = true;
            }
          });
        } else {
          listItem.parentElement.removeChild(listItem);
    
          todoArr.forEach(function (todo) {
            if (todo.id === task.id) {
              todo.complete = false;
            }
          });
        }
    
        setLocalStorage(todoArr);
      });
    
      if (task.complete) {
        completedtasks(newLi);
      } else {
        doingUl.appendChild(newLi);
      }
      
    });
  }

function completedtasks(task){
    completeList.append(task)
}

function getLocalStorage(){
    let localStorageTodos = JSON.parse(localStorage.getItem('todos'))
    if(localStorageTodos) {
        todoArr = localStorageTodos
    }else {
        todoArr = []
    }
    creatNewTaskElement(todoArr)
}

taskInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      addNewTodo();
    }
});

function editTodo() {
  var listItem = this.parentElement.parentElement;
  var label = listItem.querySelector('label');
  var editInput = listItem.querySelector('input[type=text]');
  var editMode = listItem.querySelector('.editMode');
  var saveIcon = listItem.querySelector('.save');
  var editIcon = listItem.querySelector('.edit');

  listItem.classList.toggle('editMode');

  if (listItem.classList.contains('editMode')) {
    editInput.value = label.innerHTML;
    editInput.style.display = 'inline';
    label.style.display = 'none';
    saveIcon.style.display = 'inline-block';
    editIcon.style.display = 'none';
  } else {
    label.innerHTML = editInput.value;
    editInput.style.display = 'none';
    label.style.display = 'inline';
    saveIcon.style.display = 'none';
    editIcon.style.display = 'inline-block';

    var updatedTaskName = editInput.value;
    var taskId = parseInt(listItem.getAttribute('data-id'));

    todoArr.forEach(function (todo) {
      if (todo.id === taskId) {
        todo.taskName = updatedTaskName;
      }
    });

    setLocalStorage(todoArr);
    
  }
}

function removeTodo (todoId) {
  let localStorageTodos = JSON.parse(localStorage.getItem('todos'))

  todoArr = localStorageTodos

  let mainTodoIndex = todoArr.findIndex(function (todo) {
      return todo.id === todoId
  })

  todoArr.splice(mainTodoIndex, 1)

  setLocalStorage(todoArr)
  creatNewTaskElement(todoArr)

}

addBtn.addEventListener('click', addNewTodo)
window.addEventListener('load', getLocalStorage)

