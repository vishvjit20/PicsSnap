let videoPlayer = document.querySelector("video");

let promiseToCamera = navigator.mediaDevices.getUserMedia({ video: true });

promiseToCamera
  .then(function (mediaStream) {
    videoPlayer.srcObject = mediaStream;
    console.log(mediaStream);
  })
  .catch(function () {
    console.log("Permission denied");
  });
