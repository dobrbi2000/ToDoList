import { UserData } from './types';
import { request } from './api';
import { pages } from './pages';

export function createNewUser() {
  const form = document.getElementById('logonForm') as HTMLElement | null;
  if (form) {
    form.addEventListener('submit', async (event: Event) => {
      event.preventDefault();

      const userData: UserData = {};
      document.querySelectorAll<HTMLInputElement>('#logonForm input').forEach((input) => {
        userData[input.name] = input.value;
      });

      console.log('User information sending to API:', userData);

      try {
        const action = form.getAttribute('action');
        const method = form.getAttribute('method')?.toUpperCase();
        const result = await request({
          suffix: action,
          method: method,
          body: userData,
        });
        if (result) {
          pages.todo();
        } else {
          console.error('Failed to create user');
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    });
  } else {
    console.error('logonForm not found');
  }
}

export async function loginUser(): Promise<void> {
  const form = document.getElementById('loginForm') as HTMLHtmlElement | null;
  if (form) {
    form.addEventListener('submit', async (event: Event) => {
      event.preventDefault();

      const userData: UserData = {};
      document.querySelectorAll<HTMLInputElement>('#loginForm input').forEach((input) => {
        userData[input.name] = input.value;
      });

      console.log('User information sending to API:', userData);
      try {
        const action = form.getAttribute('action');
        const method = form.getAttribute('method')?.toUpperCase();
        const result = await request({
          suffix: action,
          method: method,
          body: userData,
        });
        if (result) {
          pages.todo();
        } else {
          pages.signup();
        }
      } catch (error) {
        console.error('Error during login:', error);
        pages.signup();
      }
    });
  } else {
    console.error('loginForm not found');
  }
}
