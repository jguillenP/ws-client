import './style.css';
import { connectToServer, connectToServerWithoutToken } from './socket-client';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>
    <input id="token" placeholder="Json Web Token"/>
    <button id="btn">Connect</button>
    <br/>
    <span id="server-status">offline</span>
    <ul id="clients-ul"></ul>
    <form id="message-form">
      <input placeholder="Message" id="message-input"/>
    </form>
    <h3>Messages</h3>
    <ul id="messages-list"></ul>
  </div>
`;


const tokenInput = document.querySelector<HTMLInputElement>('#token')!;
const btn = document.querySelector<HTMLButtonElement>('#btn')!;

btn.addEventListener('click', () => {
  const token: string = tokenInput.value.trim();

  if (token.length <= 0) {
    return alert('Enter a valid JWT');
  }

  connectToServer(token);
});
connectToServerWithoutToken();
