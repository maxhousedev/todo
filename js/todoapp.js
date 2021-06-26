'use strict';

// заголовок
const createUserTitle = (title) => {
  let userTitle = document.createElement('h2');
  userTitle.textContent = title;
  userTitle.classList.add('mb-3', 'text-center');

  return userTitle;
};

// формa
const createTodoForm = (userID, userTitle) => {
  let form = document.createElement('form');
  form.classList.add('input-group', 'mb-3');
  form.setAttribute('data-userid', userID);
  form.setAttribute('data-usertitle', userTitle);

  let input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.classList.add('form-control');
  input.placeholder = 'Введите название задачи';

  let btnWrapper = document.createElement('div');
  btnWrapper.classList.add('input-group-append');

  let btnAddTask = document.createElement('button');
  btnAddTask.classList.add('btn', 'btn-primary');
  btnAddTask.setAttribute('type', 'submit');
  btnAddTask.setAttribute('disabled', 'true');
  btnAddTask.textContent = 'Добавить задачу';

  btnWrapper.append(btnAddTask);
  form.append(input);
  form.append(btnWrapper);

  let list = document.createElement('ul');
  list.classList.add('list-group');

  return {
    form,
    input,
    btnAddTask,
    list,
  };
};

// элемент списка
const createTodoItem = (task) => {
  let item = document.createElement('li');
  item.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-item-center',
    'mb-3'
  );

  // для отображения задачи в спсике
  let note = document.createElement('div');
  note.setAttribute('aria-label', 'задача');
  note.textContent = task;
  item.append(note);

  // группа управляющих конпок
  let btnGroup = document.createElement('div');
  btnGroup.classList.add('btn-group', 'btn-group-sm');
  item.append(btnGroup);

  // кнопка выполнено
  let btnDone = document.createElement('button');
  btnDone.classList.add('btn', 'btn-success');
  btnDone.setAttribute('type', 'button');
  btnDone.textContent = 'Готово!';
  btnGroup.append(btnDone);

  // конпка удалить задачу
  let btnDelete = document.createElement('buttton');
  btnDelete.classList.add('btn', 'btn-danger');
  btnDelete.setAttribute('type', 'button');
  btnDelete.textContent = 'Удалить';
  btnGroup.append(btnDelete);

  return {
    item,
    note,
    btnDone,
    btnDelete,
  };
};

// задача выполнена
const setDoneStatus = (btnDone, userID, todoes) => {
  btnDone.addEventListener('click', (e) => {
    let currentTaskName =
      e.currentTarget.parentElement.previousElementSibling.textContent;
    // ***
    // статус выполнено
    todoes.forEach((todo) => {
      if (todo.name == currentTaskName) todo.done = !todo.done;
    });
    // загрузка в localStirage
    localStorage.setItem(userID, JSON.stringify(todoes));
    // ***

    e.currentTarget.parentElement.parentElement.classList.toggle(
      'list-group-item-success'
    );
  });
};

// удалить задачу
const deleteTodo = (btnDelete, userID, todoes) => {
  btnDelete.addEventListener('click', (e) => {
    if (confirm('Уверены?')) {
      let currentTaskName =
        e.currentTarget.parentElement.previousElementSibling.textContent;
      // ***
      let indexOfDeleted = todoes.findIndex(
        (item) => item.name == currentTaskName
      );
      if (indexOfDeleted > -1) {
        todoes.splice(indexOfDeleted, 1);
      }
      // загрузка в localStirage
      localStorage.setItem(userID, JSON.stringify(todoes));
      // ***
      e.currentTarget.parentElement.parentElement.remove();
    }
  });
};

// disable для кнопки
const btnAddTaskToggleDisable = (todoForm) => {
  todoForm.input.addEventListener('input', () => {
    todoForm.btnAddTask.removeAttribute('disabled');
  });
  todoForm.input.addEventListener('blur', () => {
    if (!todoForm.input.value) {
      todoForm.btnAddTask.setAttribute('disabled', 'true');
    }
  });
};

// export
let todo = {
  // точка монтирования
  createMount: function (root) {
    root.classList.add('container', 'mb-5', 'py-4', 'bg-light', 'border');
  },

  // приложение
  createTodoApp: function (
    // точка монтирования
    mount,
    // ID
    userID,
    // имя пользователя
    userTitle,
    // список задач
    uploadedTask = []
  ) {
    // заголовок
    let title = createUserTitle(userTitle);
    mount.append(title);

    // форма
    let todoForm = createTodoForm(userID, userTitle);
    mount.append(todoForm.form);

    // список задач
    let todoList = todoForm.list;
    mount.append(todoList);

    // disable для кнопки
    btnAddTaskToggleDisable(todoForm);

    // ***
    // загрузка задач
    if (Array.isArray(uploadedTask) && uploadedTask.length) {
      for (let i = 0; i < uploadedTask.length; ++i) {
        if (uploadedTask[i].userTitle == userTitle) {
          let todoItem = createTodoItem(uploadedTask[i].name);
          todoForm.list.append(todoItem.item);
          if (uploadedTask[i].done) {
            todoItem.item.classList.add('list-group-item-success');
          }
          // задача выполнена
          setDoneStatus(todoItem.btnDone, userID, uploadedTask);

          // удалить задачу
          deleteTodo(todoItem.btnDelete, userID, uploadedTask);
        }
      }
    }
    // ***

    // массив для загрузки задач в localstorage
    let todoes = [];

    todoForm.form.addEventListener('submit', (e) => {
      e.preventDefault();
      let todoItem = createTodoItem(todoForm.input.value);
      todoForm.list.append(todoItem.item);

      // ***
      // сохранение задачи
      let todo = {};
      todo.userTitle = userTitle;
      todo.name = todoForm.input.value;
      todo.done = false;
      todoes.push(todo);
      // ***

      // обнуление формы
      todoForm.input.value = '';
      todoForm.btnAddTask.setAttribute('disabled', 'true');

      // задача выполнена
      setDoneStatus(todoItem.btnDone, userID, todoes);

      // удалить задачу
      deleteTodo(todoItem.btnDelete, userID, todoes);

      // ***
      // загрузка в localStirage
      localStorage.setItem(userID, JSON.stringify(todoes));
      // ***
    });
  },
};

export { todo };
