'use strict';

import { todo } from './todoapp.js';

document.addEventListener('DOMContentLoaded', () => {
  let root = document.getElementById('root');
  // ID пользователя
  const userID = 'mom',
    // заголовок
    userTitle = 'Mom`s todoes';

  todo.createMount(root);

  // Загрузка
  let restoredTodoes = JSON.parse(localStorage.getItem(userID)) || [];

  todo.createTodoApp(root, userID, userTitle, restoredTodoes);
});
