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
const specialBtn = document.getElementById("showListing");
// first function gets executed as soon as the page is fully loaded.
function setup() {
  listShows(allShows);
  makePageForEpisodes(allShows);
  specialBtn.addEventListener("click", () => {
    makePageForEpisodes(allShows);
    specialBtn.style.display = "none";
  });
  searchBox.addEventListener("input", () => {
    let resultNumber = document.getElementById("resultNumber");
    let results;
    if (selectShow.value === "novalue") {
      results = allShows.filter(containsSearchTerm);
    } else {
      results = liveEpisodes.filter(containsSearchTerm);
    }
    makePageForEpisodes(results);
    resultNumber.innerText = `found ${results.length} results`;
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
      while (selectEpisode.lastChild.value !== "novalue") {
        selectEpisode.removeChild(selectEpisode.lastChild);
      }
      makePageForEpisodes(allShows);
    } else {
      getData(show);
    }
  });
}
function getData(source) {
  fetch(source)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      liveEpisodes = data;
      makePageForEpisodes(liveEpisodes);
      listEpisodes(liveEpisodes);
    })
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
function makeShowInfo(episode) {
  let infoContainer = document.createElement("section");
  infoContainer.innerHTML = "<strong>Show Information:</strong>";
  infoContainer.append(
    makeShowGenres(episode),
    makeShowStatus(episode),
    makeShowRating(episode)
  );
  return infoContainer;
}
function makeShowGenres(episode) {
  let genresInfo = document.createElement("div");
  genresInfo.innerHTML = "<strong>Genres:</strong> ";
  episode.genres.forEach((type) => {
    let genre = document.createElement("span");
    if (episode.genres.length > 1) {
      genre.innerText = type + " | ";
    } else {
      genre.innerText = type;
    }

    genresInfo.append(genre);
  });
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
  if (makeNameCode(episode).innerText === "It's a TV Show") {
    episodeTitle.append(makeName(episode));
  } else {
    episodeTitle.append(makeName(episode), makeNameCode(episode));
  }
  return episodeTitle;
}
function makeName(episode) {
  let episodeName = document.createElement("div");

  episodeName.classList.add("btn-group", "name");

  if (episode.genres) {
    let show = `https://api.tvmaze.com/shows/${episode.id}/episodes`;
    let showLink = document.createElement("a");
    showLink.href = "#top";
    showLink.style.color = "white";
    showLink.innerText = episode.name;
    showLink.addEventListener("click", () => {
      specialBtn.style.display = "block";
      getData(show);
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
