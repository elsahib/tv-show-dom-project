// Global variables
const rootElem = document.getElementById("root");
let searchBox = document.getElementById("search");
const allShows = getAllShows().sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});
let liveEpisodes;
const selectEpisode = document.getElementById("allEpisodes");
const selectShow = document.getElementById("allShows");
// first function gets executed as soon as the page is fully loaded.
function setup() {
  listShows(allShows);
  getData("https://api.tvmaze.com/shows/82/episodes");

  searchBox.addEventListener("input", () => {
    let resultNumber = document.getElementById("resultNumber");
    let results = liveEpisodes.filter(containsSearchTerm);
    makePageForEpisodes(results);
    resultNumber.innerText = `${results.length} out of  ${liveEpisodes.length} Episodes`;
    if (results.length > 0) {
      resultNumber.className = "";
      resultNumber.classList.add("badge", "badge-success");
    } else {
      resultNumber.className = "";
      resultNumber.classList.add("badge", "badge-danger");
    }
    if (searchBox.value.length == 0) {
      resultNumber.innerText = "";
    }
  });
  selectEpisode.addEventListener("change", () => {
    if (selectEpisode.value === "novalue") {
      makePageForEpisodes(liveEpisodes);
    } else {
      let result = liveEpisodes.filter((episode) => {
        return episode.id == selectEpisode.value;
      });
      makePageForEpisodes(result);
    }
  });
  selectShow.addEventListener("change", () => {
    let show = `https://api.tvmaze.com/shows/${selectShow.value}/episodes`;
    if (selectShow.value === "novalue") {
      getData("https://api.tvmaze.com/shows/82/episodes");
    }
    getData(show);
  });
}

function getData(source) {
  fetch(source)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      liveEpisodes = data;
    })
    .then(() => makePageForEpisodes(liveEpisodes))
    .then(() => listEpisodes(liveEpisodes))
    .catch((error) => console.log(error));
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
    makeBody(episode),
    makeEpisodeFooter(episode)
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
function makeEpisodeFooter(episode) {
  let episodeFooter = document.createElement("div");
  episodeFooter.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "episodefooter"
  );
  episodeFooter.append(makeLink(episode), makeTime(episode));
  return episodeFooter;
}
function makeTime(episode) {
  let episodeTime = document.createElement("small");
  episodeTime.classList.add("text-muted");
  episodeTime.innerText = `Duration: ${episode.runtime} min`;
  return episodeTime;
}
function makeLink(episode) {
  let episodeLink = document.createElement("a");
  episodeLink.classList.add("btn", "btn-sm", "btn-outline-secondary");
  episodeLink.href = episode.url;
  episodeLink.target = "_blank";
  episodeLink.innerText = "View it on TVMaze";
  return episodeLink;
}
function makeImage(episode) {
  let episodeImg = document.createElement("img");
  episodeImg.classList.add("bd-placeholder-img", "card-img-top");
  if (episode.image) {
    episodeImg.src = episode.image.medium;
  } else {
    episodeImg.src = "Imageplaceholder.png";
  }

  return episodeImg;
}

function makeBody(episode) {
  let episodeBody = document.createElement("div");
  episodeBody.classList.add("card-body");
  if (episode.summary) {
    episodeBody.innerHTML = episode.summary;
  } else {
    episodeBody.innerText = "Sorry, We can't find a summary for this episode!";
  }

  return episodeBody;
}

function listEpisodes(episodes) {
  while (selectEpisode.lastChild.value !== "novalue") {
    // I don't know why it only works when it's > 2. it should work when it's > 1.
    selectEpisode.removeChild(selectEpisode.lastChild);
  }
  episodes.forEach((episode) => {
    let dropDownOption = document.createElement("option");
    dropDownOption.value = episode.id;
    dropDownOption.innerText = `${makeCode(episode)} - ${episode.name}`;
    selectEpisode.appendChild(dropDownOption);
  });
}
function listShows(shows) {
  shows.forEach((show) => {
    let option = document.createElement("option");
    option.value = show.id;
    option.innerText = `${show.name}`;
    selectShow.append(option);
  });
}
function containsSearchTerm(episode) {
  if (episode.summary) {
    return (
      episode.summary.toLowerCase().includes(searchBox.value.toLowerCase()) ||
      episode.name.toLowerCase().includes(searchBox.value.toLowerCase())
    );
  }
}
window.onload = setup;
