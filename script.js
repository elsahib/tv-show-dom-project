// Global variables
"use strict";
const rootElem = document.getElementById("root");
const searchBox = document.getElementById("search");
const allShows = getAllShows().sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});
let liveEpisodes = [];
const selectEpisode = document.getElementById("allEpisodes");
const selectShow = document.getElementById("allShows");
const homeBtn = document.getElementById("home");
const currentShow = document.getElementById("currentShow");
const myModal = document.getElementById("myModal"),
  modalTitle = document.getElementById("modalTitle"),
  modalContent = document.getElementById("modalContent"),
  modalClose = document.getElementById("closeModal");
// first function gets executed as soon as the page is fully loaded.
function setup() {
  listShows(allShows);
  makePageForContent(allShows);
}

homeBtn.addEventListener("click", () => {
  selectShow.value = "novalue";
  clearEpisodesList();
  makePageForContent(allShows);
  homeBtn.removeAttribute("href");
  currentShow.innerText = "";
});

selectEpisode.addEventListener("change", () => {
  if (selectEpisode.value === "novalue") {
    makePageForContent(liveEpisodes);
  } else {
    let result = liveEpisodes.filter((episode) => {
      return episode.id == selectEpisode.value;
    });
    makePageForContent(result);
  }
});

selectShow.addEventListener("change", () => {
  let show = `https://api.tvmaze.com/shows/${selectShow.value}/episodes`;

  if (selectShow.value === "novalue") {
    clearEpisodesList();
    makePageForContent(allShows);
    homeBtn.removeAttribute("href");
    currentShow.innerText = "";
  } else {
    getData(show);
    homeBtn.href = "#";
    currentShow.innerText = selectShow["selectedOptions"][0].textContent;
  }
});

searchBox.addEventListener("input", () => {
  let results;
  if (selectEpisode.childElementCount > 2) {
    results = liveEpisodes.filter(containsSearchTerm);
  } else {
    results = allShows.filter(containsSearchTerm);
  }
  makePageForContent(results);
});

modalClose.addEventListener("click", () => {
  myModal.style.display = "none";
  modalContent.innerHTML = "";
  document.body.classList.remove("modal-open");
});

function displayNumberOfResults(filtered) {
  let resultNumber = document.getElementById("resultNumber");
  if (selectEpisode.childElementCount > 1) {
    resultNumber.innerText = `${filtered.length} out of ${liveEpisodes.length} Episodes`;
  } else {
    resultNumber.innerText = `${filtered.length} out of ${allShows.length} Shows`;
  }
  if (filtered.length > 0) {
    resultNumber.className = "";
    resultNumber.classList.add("badge", "badge-success");
  } else {
    resultNumber.className = "";
    resultNumber.classList.add("badge", "badge-danger");
  }
}

function getData(source) {
  fetch(source)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      liveEpisodes = data;
      listEpisodes(liveEpisodes);
      makePageForContent(liveEpisodes);
    })
    .catch((error) => console.error(error));
}

function makePageForContent(episodeList) {
  rootElem.innerHTML = "";
  episodeList.forEach((episode) => {
    rootElem.append(makeCardContainer(episode));
  });

  displayNumberOfResults(episodeList);
  document.querySelectorAll(".castLink").forEach((item) => {
    item.addEventListener("click", attacheEventToCastLink);
  });
}
function makeCardShadow(episode) {
  let episodeShadow = document.createElement("div");
  episodeShadow.classList.add("card", "mb-4", "shadow-sm");

  episodeShadow.append(
    makeCardTitle(episode),
    makeCardImage(episode),
    makeCardBody(episode),
    makeCardFooter(episode)
  );

  return episodeShadow;
}

function makeShowInfo(episode) {
  let infoContainer = document.createElement("section");
  infoContainer.innerHTML = "<strong>About this show:</strong>";
  infoContainer.append(
    makeShowCastLink(episode),
    makeShowGenres(episode),
    makeShowStatus(episode),
    makeShowRating(episode)
  );
  return infoContainer;
}

function makeShowCastLink(episode) {
  let castInfo = document.createElement("div"),
    castLink = document.createElement("span");
  castInfo.innerHTML = "<strong>Casting Crew:</strong> ";
  castLink.innerText = "View Crew List";
  castLink.classList.add("btn-link", "castLink");
  castInfo.append(castLink);
  castLink.id = episode.id;

  return castInfo;
}

function attacheEventToCastLink(e) {
  getCastDataToModal(e.target.id);
}
function makeShowGenres(episode) {
  let genresInfo = document.createElement("div");
  genresInfo.innerHTML = "<strong>Genres:</strong> ";
  let genre = episode.genres.join(" | ");
  genresInfo.append(genre);
  return genresInfo;
}

function makeShowStatus(episode) {
  let showStatus = document.createElement("div");
  showStatus.innerHTML = `<strong>Status:</strong> ${episode.status}`;
  return showStatus;
}

function makeShowRating(episode) {
  let showRating = document.createElement("div");
  showRating.innerHTML = `<strong>Rated:</strong> ${episode.rating.average}`;
  return showRating;
}

function makeCardContainer(episode) {
  let episodeContainer = document.createElement("div");
  episodeContainer.classList.add("col-md-4");
  episodeContainer.append(makeCardShadow(episode));
  return episodeContainer;
}

function makeCardTitle(episode) {
  let episodeTitle = document.createElement("div");
  episodeTitle.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  episodeTitle.id = "title";
  if (makeNameCode(episode).innerText === "It's a TV Show") {
    episodeTitle.append(makeCardName(episode));
  } else {
    episodeTitle.append(makeCardName(episode), makeNameCode(episode));
  }
  return episodeTitle;
}

function getCastDataToModal(episodeId) {
  fetch(`https://api.tvmaze.com/shows/${episodeId}?embed=cast`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let actors = data._embedded.cast;
      actors.forEach((actor) => {
        modalContent.append(makeActorFigure(actor));
        modalTitle.innerText = `${data.name}'s Cast Crew`;
        myModal.style.display = "block";
        document.body.classList.add("modal-open");
      });
    })
    .catch((error) => console.error(error));
}

function makeActorCaption(actor) {
  let actorName = document.createElement("figcaption");
  actorName.classList.add("figure-caption", "font-weight-bold");
  actorName.innerText = actor.person.name;
  return actorName;
}

function makeActorImage(actor) {
  let actorImage = document.createElement("img");
  actorImage.classList.add("figure-img", "img-fluid", "rounded");
  actorImage.alt = actor.person.name;
  actorImage.src = actor.person.image.medium;
  return actorImage;
}

function makeActorFigure(actor) {
  let actorContainer = document.createElement("figure");
  actorContainer.classList.add("figure");
  actorContainer.append(makeActorImage(actor), makeActorCaption(actor));
  return actorContainer;
}

function makeCardName(episode) {
  let episodeName = document.createElement("div");

  episodeName.classList.add("btn-group", "name");

  if (episode.genres) {
    let show = `https://api.tvmaze.com/shows/${episode.id}/episodes`;
    let showLink = document.createElement("a");
    showLink.href = "#top";
    showLink.style.color = "white";
    showLink.innerText = episode.name;
    showLink.addEventListener("click", () => {
      getData(show);
      selectShow.value = episode.id;
      homeBtn.href = "#";
      currentShow.innerText = episode.name;
    });
    episodeName.append(showLink);
  } else {
    episodeName.innerText = episode.name;
  }
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
  let code = "It's a TV Show";
  if (episode.season) {
    code =
      "S" +
      episode.season.toString().padStart(2, "0") +
      "E" +
      episode.number.toString().padStart(2, "0");
  }
  return code;
}

function makeCardFooter(episode) {
  let episodeFooter = document.createElement("div");
  episodeFooter.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "episodefooter"
  );
  episodeFooter.append(makeTVMazeLink(episode), makeTimeDisplay(episode));
  return episodeFooter;
}

function makeTimeDisplay(episode) {
  let episodeTime = document.createElement("small");
  episodeTime.classList.add("text-muted");
  episodeTime.innerText = `Duration: ${episode.runtime} min`;
  return episodeTime;
}

function makeTVMazeLink(episode) {
  let episodeLink = document.createElement("a");
  episodeLink.classList.add("btn", "btn-sm", "btn-outline-secondary");
  episodeLink.href = episode.url;
  episodeLink.target = "_blank";
  episodeLink.innerText = "View it on TVMaze";
  return episodeLink;
}

function makeCardImage(episode) {
  let episodeImg = document.createElement("img");
  episodeImg.classList.add("bd-placeholder-img", "card-img-top");
  if (episode.image) {
    episodeImg.src = episode.image.medium;
  } else {
    episodeImg.src = "Imageplaceholder.png";
  }
  return episodeImg;
}

function makeCardBody(episode) {
  let episodeBody = document.createElement("div");
  episodeBody.classList.add("card-body");
  if (episode.genres) {
    episodeBody.append(makeShowInfo(episode));
  }
  if (episode.summary) {
    episodeBody.innerHTML +=
      "<strong>Summary:</strong> <br/>" + episode.summary;
  } else {
    episodeBody.innerText += "Sorry, We can't find a summary for this episode!";
  }
  return episodeBody;
}

function listEpisodes(episodes) {
  clearEpisodesList();
  episodes.forEach((episode) => {
    let dropDownOption = document.createElement("option");
    dropDownOption.value = episode.id;
    dropDownOption.innerText = `${makeCode(episode)} - ${episode.name}`;
    selectEpisode.appendChild(dropDownOption);
  });
}

function clearEpisodesList() {
  while (selectEpisode.lastChild.value !== "novalue") {
    selectEpisode.removeChild(selectEpisode.lastChild);
  }
  searchBox.value = "";
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
  let inTitle, inSummary, inGenres;
  if (episode.summary) {
    inSummary = episode.summary
      .toLowerCase()
      .includes(searchBox.value.toLowerCase());
  }
  inTitle = episode.name.toLowerCase().includes(searchBox.value.toLowerCase());
  if (episode.genres) {
    let allGenres = [];
    inGenres = episode.genres.forEach((item) => {
      allGenres.push(item.toLowerCase());
    });
    inGenres = allGenres.includes(searchBox.value.toLowerCase());
  }
  return inTitle || inSummary || inGenres;
}

window.onload = setup;
