const WebSocket = require('ws');

function sendMessages(ducts, messages) {
  ducts.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      messages.forEach((message) => client.send(message));
    }
  });
}

module.exports = sendMessages;
