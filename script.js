// Global variables
const rootElem = document.getElementById("root");
let searchBox = document.getElementById("search");
const allEpisodes = getAllEpisodes();
const selectEpisode = document.getElementById("allEpisodes");
// first function gets executed as soon as the page is fully loaded.
function setup() {
  makePageForEpisodes(allEpisodes);

  listEpisodes(allEpisodes);

  searchBox.addEventListener("input", () => {
    let resultNumber = document.getElementById("resultNumber");
    let results = allEpisodes.filter(containsSearchTerm);
    makePageForEpisodes(results);
    resultNumber.innerText = `${results.length} / ${allEpisodes.length}`;
    if (searchBox.value.length == 0) {
      resultNumber.innerText = "";
    }
  });

  selectEpisode.addEventListener("change", () => {
    if (selectEpisode.value === "novalue") {
      makePageForEpisodes(allEpisodes);
    } else {
      let result = allEpisodes.filter((episode) => {
        return episode.id == selectEpisode.value;
      });
      makePageForEpisodes(result);
    }
  });
}

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";
  episodeList.forEach((episode) => {
    rootElem.append(makeContainer(episode));
  });
}

function makeShadow(episode) {
  let episodeShadow = document.createElement("div");
  episodeShadow.classList.add("card", "mb-4", "shadow-sm");
  episodeShadow.append(
    makeTitle(episode),
    makeImage(episode),
    makeBody(episode)
  );
  return episodeShadow;
}

function makeContainer(episode) {
  let episodeContainer = document.createElement("div");
  episodeContainer.classList.add("col-md-4");
  episodeContainer.append(makeShadow(episode));
  return episodeContainer;
}

function makeTitle(episode) {
  let episodeTitle = document.createElement("div");
  episodeTitle.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  episodeTitle.id = "title";
  episodeTitle.append(makeName(episode), makeNameCode(episode));
  return episodeTitle;
}

function makeName(episode) {
  let episodeName = document.createElement("div");
  episodeName.classList.add("btn-group", "name");
  episodeName.innerText = episode.name;
  return episodeName;
}

function makeNameCode(episode) {
  let episodeNameCode = document.createElement("mediuem");
  episodeNameCode.classList.add("episodeNameCode");
  episodeNameCode.id = "episodeNameCode";
  episodeNameCode.innerText = makeCode(episode);
  return episodeNameCode;
}

function makeCode(episode) {
  return (
    "S" +
    episode.season.toString().padStart(2, "0") +
    "E" +
    episode.number.toString().padStart(2, "0")
  );
}

function makeImage(episode) {
  let episodeImg = document.createElement("img");
  episodeImg.classList.add("bd-placeholder-img", "card-img-top");
  episodeImg.src = episode.image.medium;
  return episodeImg;
}

function makeBody(episode) {
  let episodeBody = document.createElement("div");
  episodeBody.classList.add("card-body");
  episodeBody.innerHTML = episode.summary;
  return episodeBody;
}

function listEpisodes(episodes) {
  episodes.forEach((episode) => {
    let dropDownOption = document.createElement("option");
    dropDownOption.value = episode.id;
    dropDownOption.innerText = `${makeCode(episode)} - ${episode.name}`;
    selectEpisode.appendChild(dropDownOption);
  });
}

function containsSearchTerm(episode) {
  return (
    episode.summary.toLowerCase().includes(searchBox.value.toLowerCase()) ||
    episode.name.toLowerCase().includes(searchBox.value.toLowerCase())
  );
}
window.onload = setup;
