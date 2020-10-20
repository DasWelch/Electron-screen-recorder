//front end code

const videoElement = document.querySelector("video");
const startBTN = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const videoSelectBtn = document.getElementById("videoSelectBtn");

videoSelectBtn.onclick = getVideoSources;

const { desktopCapturer, remote } = require("electron");
const { Menu } = remote

async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });
console.log(Menu);

const videoOptionMenu = Menu.buildFromTemplate (
  inputSources.map(source => {
    return {
      label: source.name,
    };
  })
);

videoOptionMenu.popup();

}