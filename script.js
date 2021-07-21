navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function () {
    console.log("Permission given");
  })
  .catch(function () {
    console.log("Permission denied");
  });
