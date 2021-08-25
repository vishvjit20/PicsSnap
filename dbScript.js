let req = indexedDB.open("gallery");
let db;

req.addEventListener("success", function () {
  db = req.result;
  console.log(db);
});
req.addEventListener("upgradeneeded", function () {
  db = req.result;
  db.createObjectStore("media", { keyPath: "mId" });
});
req.addEventListener("error", function () {});

function saveMedia(media) {
  if (!db) return;
  let data = {
    mId: Date.now(),
    mediaData: media,
  };

  let tx = db.transaction("media", "readwrite");
  let mediaObjectStore = tx.objectStore("media");
  mediaObjectStore.add(data);
}

function viewMedia() {
  if (!db) return;

  let galleryContainer = document.querySelector(".gallery-container");

  let tx = db.transaction("media", "readwrite");
  let mediaObjectStore = tx.objectStore("media");
  let req = mediaObjectStore.openCursor();
  req.addEventListener("success", function () {
    cursor = req.result;
    if (cursor) {
      console.log(cursor.value);

      let mediaCard = document.createElement("div");
      mediaCard.classList.add("media-card");
      mediaCard.innerHTML = `<div class="actual-media"></div>
      <div class="media-buttons">
        <button class="media-download">Download</button>
        <button class="media-delete">Delete</button>
      </div>`;

      let actualMediaDiv = mediaCard.querySelector(".actual-media");
      let data = cursor.value.mediaData;
      let type = typeof data;
      if (type == "string") {
        // image
        let image = document.createElement("img");
        image.src = data;
        actualMediaDiv.append(image);
      } else if (type == "object") {
        // video
        let url = URL.createObjectURL(data);
        let video = document.createElement("video");

        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.controls = true;
        actualMediaDiv.appendChild(video);
      }

      galleryContainer.append(mediaCard);
      cursor.continue();
    }
  });
}
