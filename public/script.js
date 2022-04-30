var peer = new Peer();

// Get Element from HTML
const selfCam = document.getElementById("selfCam");
const friendCam = document.getElementById("friendCam");
const display = document.getElementById("display");

// IDs
let myPeerId;

var user1;
var user2;

peer.on("open", function (id) {
  console.log("My peer ID is: " + id);
  myPeerId = id + "";

  if (friendId == "") {
    fetch(`/setId/${myPeerId}`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  // Video Stream
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      // Setting Stream of self Camera
      selfCam.srcObject = stream;
      selfCam.onloadedmetadata = () => {
        selfCam.play();
      };

      // Calling Friend
      if (friendId) {
        const call = peer.call(friendId, stream);

        // Setting recieved friend's stream
        call.on("stream", function (fStream) {
          // Setting Friend's stream to video tag
          friendCam.srcObject = fStream;
          friendCam.onloadedmetadata = () => {
            friendCam.play();
          };
        });

        // Message
        var dataConn1 = peer.connect(friendId);
        dataConn1.on("open", function () {
          // Receive messages
          dataConn1.on("data", function (data) {
            addMesage(`Friend: ${data}`);
          });

          // Send messages
          window.dataConn1 = dataConn1;
        });
      }

      // Receive Message
      peer.on("connection", function (dataConn2) {
        dataConn2.on("open", function () {
          // Receive messages
          dataConn2.on("data", function (data) {
            // console.log("Received", data);
            addMesage(`Friend: ${data}`);
          });

          // Send messages
          window.dataConn2 = dataConn2;
        });
      });

      // Recieving Call
      peer.on("call", function (call) {
        // Answering a call with our stream
        call.answer(stream);

        call.on("stream", function (fStream) {
          friendCam.srcObject = fStream;
          friendCam.onloadedmetadata = () => {
            friendCam.play();
          };
        });
      });
    });

  peer.on("error", (err) => {
    console.log(err.type);
  });

  peer.on("close", () => {
    const source = document.createElement("source");
    source.src = "/searching.mp4";
    source.type = "video/mp4";
    friendCam.append(source);
  });
});

function addMesage(message) {
  const li = document.createElement("li");
  li.innerText = message;
  display.append(li);
}

function sendMessage() {
  text = document.getElementById("msg").value;
  try {
    dataConn1.send(text);
  } catch {
    dataConn2.send(text);
  }
  addMesage(`Me: ${text}`);
}
const input = document.getElementById("msg");
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    sendMessage();
    input.value = "";
  }
});
