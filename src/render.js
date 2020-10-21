//front end code

const { desktopCapturer, remote } = require("electron");
const { Menu, dialog } = remote;
const { writeFile } = require("fs");

const videoElement = document.querySelector("video");
const startBTN = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const videoSelectBtn = document.getElementById("videoSelectBtn");

let mediaRecorder;
const recordedChunks = [];

videoSelectBtn.onclick = getVideoSources;
startBTN.onclick = (e) => {
  mediaRecorder.start();
  startBtn.innerText = 'Recording';
};
stopBtn.onclick = (e) => {
  mediaRecorder.stop();
  startBtn.innerText = 'Start';
};

async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });
  console.log(Menu);

  const videoOptionMenu = Menu.buildFromTemplate(
    inputSources.map((source) => {
      return {
        label: source.name,
        click: () => selectSource(source),
      };
    })
  );

  videoOptionMenu.popup();
}

async function selectSource(source) {
  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
      },
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  videoElement.srcObject = stream;
  videoElement.play();

  const options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}

function handleDataAvailable(e) {
  console.log("video data available");
  recordedChunks.push(e.data);
}

async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9",
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: "Save video",
    defaultPath: `vid-${Date.now()}.webm`,
  });
  console.log(filePath);

  writeFile(filePath, buffer, (e) => console.log(e));
}
