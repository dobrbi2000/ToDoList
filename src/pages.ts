import { loadPage, updateHistory, setupEventListeners, showTasks, addClick } from './domUtils';
import { createNewUser, loginUser } from './userRequests';

export const app = document.getElementById('app') as HTMLElement;

export const pages = {
  todo: async () => {
    try {
      const text = await loadPage('todo');
      app.innerHTML = text;
      updateHistory('todo', 'ToDo Page', '/todo');
      const inputBox = document.getElementById('input-box') as HTMLInputElement;
      const listContainer = document.getElementById('list-todo-app-container') as HTMLElement;
      setupEventListeners(inputBox, listContainer);
      showTasks(listContainer);
    } catch (error) {
      console.error('Error loading the todo page:', error);
      app.innerHTML = '<p>Error loading the todo page. Please try again later.</p>';
    }
  },
  signup: async () => {
    try {
      const text = await loadPage('signup');
      app.innerHTML = text;
      updateHistory('signup', 'SignUp Page', '/signup');
      createNewUser();
      addClick('.signin-btn', pages.signin);
    } catch (error) {
      console.error('Error loading the signup page:', error);
      app.innerHTML = '<p>Error loading the signup page. Please try again later.</p>';
    }
  },
  signin: async () => {
    try {
      const text = await loadPage('signin');
      app.innerHTML = text;
      updateHistory('signin', 'SignIn Page', '/signin');
      loginUser();
      addClick('.signup-btn', pages.signup);
    } catch (error) {
      console.error('Error loading the signin page:', error);
      app.innerHTML = '<p>Error loading the signin page. Please try again later.</p>';
    }
  },
};
