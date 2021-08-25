let req = indexedDB.open("gallery");
let db;
let noOfMedia = 0;

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
  let backBtn = document.querySelector(".back-btn");
  galleryContainer.classList.remove("background-text");

  let tx = db.transaction("media", "readwrite");
  let mediaObjectStore = tx.objectStore("media");
  let req = mediaObjectStore.openCursor();

  backBtn.addEventListener("click", function () {
    location.assign("gallery.html");
  });

  backBtn.addEventListener("click", function () {
    location.assign("index.html");
  });

  req.addEventListener("success", function () {
    cursor = req.result;
    if (cursor) {
      noOfMedia++;

      let mediaCard = document.createElement("div");
      mediaCard.classList.add("media-card");
      mediaCard.innerHTML = `<div class="actual-media"></div>
      <div class="media-buttons">
        <button class="media-download">Download</button>
        <button data-mid="${cursor.value.mId}" class="media-delete">Delete</button>
      </div>`;

      let actualMediaDiv = mediaCard.querySelector(".actual-media");
      let downloadBtn = mediaCard.querySelector(".media-download");
      let deleteBtn = mediaCard.querySelector(".media-delete");
      deleteBtn.addEventListener("click", function (e) {
        let mId = Number(e.currentTarget.getAttribute("data-mid"));
        deleteMedia(mId);
        e.currentTarget.parentElement.parentElement.remove();
      });

      let data = cursor.value.mediaData;
      let type = typeof data;
      if (type == "string") {
        // image
        let image = document.createElement("img");
        image.src = data;

        downloadBtn.addEventListener("click", function () {
          downloadMedia(data, "image");
        });

        actualMediaDiv.append(image);
      } else if (type == "object") {
        // video
        let video = document.createElement("video");
        let url = URL.createObjectURL(data);
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.controls = true;

        downloadBtn.addEventListener("click", function () {
          downloadMedia(url, "video");
        });

        actualMediaDiv.appendChild(video);
      }

      galleryContainer.append(mediaCard);
      cursor.continue();
    }
    if (noOfMedia == 0) {
      galleryContainer.classList.add("background-text");
      galleryContainer.innerText = "No Media present";
    }
  });
}

function downloadMedia(url, type) {
  let anchor = document.createElement("a");
  anchor.href = url;
  if (type == "image") {
    anchor.download = "image.png";
  } else if (type == "video") {
    anchor.download = "video.mp4";
  }
  anchor.click();
  anchor.remove();
}

function deleteMedia(mid) {
  let tx = db.transaction("media", "readwrite");
  let mediaObjectStore = tx.objectStore("media");
  mediaObjectStore.delete(mid);
}
