export async function loadPage(pageName: string): Promise<string> {
  const result: Response = await fetch(`/pages/${pageName}.html`);
  if (!result.ok) {
    throw new Error(`Failed to load page: ${pageName}, status: ${result.status}`);
  }
  const text = await result.text();
  return text;
}

export function updateHistory(pageName: string, pageTitle: string, pagePath: string) {
  history.pushState({ page: pageName }, pageTitle, pagePath);
}

export function setupEventListeners(inputBox: HTMLInputElement, listContainer: HTMLElement): void {
  const addButton = document.getElementById('add-task-btn');
  if (addButton instanceof HTMLButtonElement) {
    addButton.addEventListener('click', () => addTask(inputBox, listContainer));
  } else {
    console.error('Add button not found');
  }

  listContainer.addEventListener('click', (event: MouseEvent) => handleEvent(event, inputBox, listContainer));
  inputBox.addEventListener('keydown', (event: KeyboardEvent) => handleEvent(event, inputBox, listContainer));
}

export function addTask(inputBox: HTMLInputElement, listContainer: HTMLElement): void {
  if (inputBox.value === '') {
    alert('You have to write something!');
  } else {
    let li = document.createElement('li');
    li.textContent = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement('span');
    span.innerHTML = '\u00d7';
    li.appendChild(span);
  }
  inputBox.value = '';
  saveData(listContainer);
}

export function addClick(selector: string, action: () => void): void {
  const button = document.querySelector(selector);
  if (button) {
    button.addEventListener('click', action);
  } else {
    console.error(`Button with selector "${selector}" not found`);
  }
}

export function handleEvent(event: Event, inputBox: HTMLInputElement, listContainer: HTMLElement) {
  const { type, target, key } = event as KeyboardEvent & MouseEvent;
  if (type === 'keydown' && key === 'Enter') {
    event.preventDefault();
    addTask(inputBox, listContainer);
  }
  if (type === 'click' && target instanceof HTMLElement) {
    if (target.tagName === 'LI') {
      target.classList.toggle('checked');
    } else if (target.tagName === 'SPAN' && target.parentElement) {
      target.parentElement.remove();
    }
  }
  saveData(listContainer);
}

export function saveData(listContainer: HTMLElement): void {
  localStorage.setItem('data', listContainer.innerHTML);
}

export function showTasks(listContainer: HTMLElement): void {
  const storeData = localStorage.getItem('data');
  listContainer.innerHTML = storeData !== null ? storeData : '';
}
