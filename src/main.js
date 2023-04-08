import {render} from "./render.js";
import {createMenuTemplate} from "./view/menu-sort-filter.js";
import {createFilmCardTemplate,createFilmListSectionTemplate} from "./view/film-card.js";
import {createUserRankTemplate} from "./view/user-rank.js";
import {createExtraSectionTemplate} from "./view/create-extra-section.js";
import {createPopupTemplate} from "./view/popup-film.js";
import {createShowMoreBtnTemplate} from "./view/show-more-btn.js";
import {generateFilm, generatePopupFilm} from "./mock/film.js";

const MOCK_FILMS_COUNT = 20;
const FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;
const EXTRA_SECTION_COUNT = 2;

const siteMainContainer = document.querySelector(".main");
const siteHeader = document.querySelector(".header");
const siteFooter = document.querySelector(".footer");


render(siteMainContainer, createMenuTemplate(), "afterbegin");
render(siteHeader, createUserRankTemplate(), "beforeend");
render(siteFooter, createPopupTemplate(generatePopupFilm()), "afterend");

render(siteMainContainer, createFilmListSectionTemplate(), "beforeend");
const filmSection = siteMainContainer.querySelector(".films");

const filmList = filmSection.querySelector(".films-list");
const filmListContainer = filmList.querySelector(".films-list__container");

render(filmList, createShowMoreBtnTemplate(), "beforeend");

for (let i = 0; i < FILM_COUNT; i++) {
    render(filmListContainer, createFilmCardTemplate(generateFilm()), "beforeend");
}

for (let i = 0; i < EXTRA_SECTION_COUNT; i++) {
    render(filmSection, createExtraSectionTemplate(), "beforeend");
}

const extraSection = siteMainContainer.querySelectorAll(".films-list--extra");


extraSection.forEach ((section)=> {
    const extraSectionContainer = section.querySelector(".films-list__container");
    for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
        render(extraSectionContainer, createFilmCardTemplate(generateFilm()), "beforeend");
    }
});

render(extraSection[1], "<h2 class=\"films-list__title\">Most commented</h2>", "afterbegin");
render(extraSection[0], "<h2 class=\"films-list__title\">Top rated</h2>", "afterbegin");

const mockFilms = Array.from({length: MOCK_FILMS_COUNT}, generateFilm);



const popupContainer = document.querySelector(".film-details");
const exitPopupBtn = popupContainer.querySelector(".film-details__close-btn");

exitPopupBtn.addEventListener("click", ()=> {
    popupContainer.remove();
});

console.log(mockFilms);