let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");

let mediaRecorder;
let chunks = [];
let isRecording = false;

recordBtn.addEventListener("click", function () {
  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
  } else {
    mediaRecorder.start();
    isRecording = true;
  }
});

let promiseToCamera = navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});

promiseToCamera
  .then(function (mediaStream) {
    videoPlayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", function (e) {
      let blob = new Blob(chunks, { type: "video/mp4" });
      chunks = [];

      // convert blob to link
      let link = URL.createObjectURL(blob);

      let a = document.createElement("a");
      a.href = link;
      a.download = "video.mp4";
      a.click();
    });

    console.log(mediaRecorder);
  })
  .catch(function () {
    console.log("Permission denied");
  });
