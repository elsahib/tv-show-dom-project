//You can edit ALL of the code here
// Global variables
const rootElem = document.getElementById("root");
let searchBox = document.getElementById("search");
const allEpisodes = getAllEpisodes();
const selectEpisode = document.getElementById("allEpisodes");
// first function gets executed as soon as the page is fully loaded.
function setup() {
  makePageForEpisodes(allEpisodes);
  // calling listEpisodes to populate the dropdown select input with options.
  listEpisodes(allEpisodes);
  // adding an event Listener to create a live search feature, using filter method through the array of episodes and utilising the
  // string includes method inside a custom made function named search
  searchBox.addEventListener("input", () => {
    let resultNumber = document.getElementById("resultNumber");
    let results = allEpisodes.filter(containsSearchTerm);
    makePageForEpisodes(results);
    resultNumber.innerText = `${results.length} / ${allEpisodes.length}`;
    if (searchBox.value.length == 0) {
      resultNumber.innerText = "";
    }
  });
  // Adding event for the dropdown selector to show only selected episode.
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
// function to display episodes inside the root element
function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = ""; // Clearing the main container
  for (let i = 0; i < episodeList.length; i++) {
    rootElem.append(makeContainer(episodeList[i]));
  }
}
// function to create the shadow container element and add it's children
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
// function to create the episode container element and add it's children
function makeContainer(episode) {
  let episodeContainer = document.createElement("div");
  episodeContainer.classList.add("col-md-4");
  episodeContainer.append(makeShadow(episode));
  return episodeContainer;
}

// function to create the title element and add it's children
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
// function to create the name element and fill it with data
function makeName(episode) {
  let episodeName = document.createElement("div");
  episodeName.classList.add("btn-group", "name");
  episodeName.innerText = episode.name;
  return episodeName;
}
// function to create the name code element and fill it with data
function makeNameCode(episode) {
  let episodeNameCode = document.createElement("mediuem");
  episodeNameCode.classList.add("episodeNameCode");
  episodeNameCode.id = "episodeNameCode";
  episodeNameCode.innerText = makeCode(episode);
  return episodeNameCode;
}

// function that generates a code for each episode
function makeCode(episode) {
  return (
    "S" +
    episode.season.toString().padStart(2, "0") +
    "E" +
    episode.number.toString().padStart(2, "0")
  );
}

// function to create the image element
function makeImage(episode) {
  let episodeImg = document.createElement("img");
  episodeImg.classList.add("bd-placeholder-img", "card-img-top");
  episodeImg.src = episode.image.medium;
  return episodeImg;
}
// function to create the body element and fill it with data
function makeBody(episode) {
  let episodeBody = document.createElement("div");
  episodeBody.classList.add("card-body");
  episodeBody.innerHTML = episode.summary;
  return episodeBody;
}

// function to return episode code and name and create the option element and fill it with data
function listEpisodes(episodes) {
  episodes.forEach((episode) => {
    let dropDownOption = document.createElement("option");
    dropDownOption.value = episode.id;
    dropDownOption.innerText = `${makeCode(episode)} - ${episode.name}`;
    selectEpisode.appendChild(dropDownOption);
  });
}
// this will return true or false based on user input.
function containsSearchTerm(episode) {
  return (
    episode.summary.toLowerCase().includes(searchBox.value.toLowerCase()) ||
    episode.name.toLowerCase().includes(searchBox.value.toLowerCase())
  );
}
window.onload = setup;
