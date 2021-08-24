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
