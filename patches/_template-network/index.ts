/* Compile to index.js before running the app. This runs in the page world. */
declare const LGX: {
  hud: { button(id: string, label: string, onClick: () => void): HTMLElement };
  modal(id: string, content: HTMLElement | string): { element: HTMLElement; close: () => void };
};

const openDialog = (): void => {
  const content = document.createElement('section');
  const heading = document.createElement('h2');
  heading.textContent = 'Сетевой шаблон';
  const description = document.createElement('p');
  description.textContent = 'Пример JSON-ответа обрабатывается изолированным network runtime как данные и выводится в журнал через LGX.log. Межмировой канал для отображения ответа здесь намеренно не используется.';
  const example = document.createElement('pre');
  example.textContent = '{\n  "status": "пример"\n}';
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = 'Закрыть';
  content.append(heading, description, example, closeButton);

  const dialog = LGX.modal('my-network-patch', content);
  closeButton.addEventListener('click', dialog.close);
};

LGX.hud.button('my-network-patch', 'Статус API', openDialog);
