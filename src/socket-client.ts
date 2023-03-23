
import { Manager, Socket } from 'socket.io-client';

interface MessagePayload {
  fullName: string;
  message: string;
}

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new  Manager('http://localhost:3000/socket.io/socket.io.js', {
    extraHeaders: {
      authentication: token,
      Authorization: `Bearer ${token}`,
    }
  });

  socket?.removeAllListeners();
  socket = manager.socket('/chat');

  addListener();
};

export const connectToServerWithoutToken = () => {
  const manager = new  Manager('http://localhost:3000/socket.io/socket.io.js');

  socket?.removeAllListeners();
  socket = manager.socket('/chat');

  socket.on('connect', () => {
    console.log('Connected');
  });
  socket.on('disconnect', () => {
    console.log('Disconnect');
  });
  socket.on("connect_error", (err) => {
    console.log({ err });
  });
  socket.on('clients_updated', (clients: any) => {
    console.log({ clients });
  });

  const form = document.querySelector<HTMLFormElement>('#message-form')!;
  const input = document.querySelector<HTMLInputElement>('#message-input')!;
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (input.value.trim().length <= 0) return;

    socket.emit('message', {
      message: input.value,
    });

  })
};

const addListener = () => {
  const serverStatusLabel = document.querySelector<HTMLSpanElement>('#server-status')!;
  const clientUl = document.querySelector<HTMLUListElement>('#clients-ul')!;
  const messagesList = document.querySelector<HTMLUListElement>('#messages-list')!;
  const form = document.querySelector<HTMLFormElement>('#message-form')!;
  const input = document.querySelector<HTMLInputElement>('#message-input')!;

  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'Connected';
  });
  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'Disconnect';
  });
  socket.on("connect_error", (err) => {
    console.log({ err });
  });
  socket.on('clients-updated', (clients: string[]) => {
    let clientsHtml = '';

    clients.forEach((clientId: string) => {
      clientsHtml += `
        <li>${ clientId }</li>
      `;
    });

    clientUl.innerHTML = clientsHtml;
  });
  socket.on('message-form-server', (payload: MessagePayload) => {
    const newMessage = `
      <li>
        <stong>${ payload.fullName }</stong>
        <span>${ payload.message }</span>
      </li>
    `;

    const li = document.createElement('li');
    li.innerHTML = newMessage;
    messagesList.append( li );
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (input.value.trim().length <= 0) return;

    socket.emit('message-form-client', {
      message: input.value,
    });

    input.value = '';
  })
};
