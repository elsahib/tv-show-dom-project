const allShows = getAllShows().sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});
const rootElem = document.getElementById("root");

function makePageForShows(showList) {
  rootElem.innerHTML = "";
  showList.forEach((show) => {
    rootElem.append(makeShowRow(show));
  });
}
function makeShowRow(show) {
  let rowContianer = document.createElement("div");
  rowContianer.classList.add("row", "mb-2");
  rowContianer.appendChild(makeShowColumn(show));
  return rowContianer;
}

function makeShowColumn(show) {
  let showColumn = document.createElement("div");
  showColumn.classList.add("col-md-6");
  showColumn.appendChild(makeShowContainer(show));
  return showColumn;
}

function makeShowContainer(show) {
  let showContainer = document.createElement("div");
  showContainer.classList.add(
    "row",
    "no-gutters",
    "border",
    "rounded",
    "overflow-hidden",
    "flex-md-row",
    "mb-4",
    "shadow-sm",
    "h-md-250",
    "position-relative"
  );
  showContainer.append(makeShowInfo(show), makeShowImageContainer(show));
  return showContainer;
}
function makeShowInfo(show) {
  let showContent = document.createElement("div");
  showContent.classList.add(
    "col",
    "p-4",
    "d-flex",
    "flex-column",
    "position-static"
  );
  showContent.innerHTML = show.summary;
  return showContent;
}

function makeShowImageContainer(show) {
  let imageContainer = document.createElement("div");
  imageContainer.classList.add("col-auto", "d-none", "d-lg-block");
  imageContainer.appendChild(makeShowImage(show));
  return imageContainer;
}
function makeShowImage(show) {
  let showImage = document.createElement("img");
  showImage.classList.add("bd-placeholder-img");
  showImage.src = show.image.medium;
  return showImage;
}
window.onload = makePageForShows(allShows);
