import {renderTemplate, renderElement, RenderPosition} from "./render.js";
import Menu from "./view/menu.js";
import SortView from "./view/sort.js";
import FilmListView from "./view/film-list-section.js";

import FilmCardView from "./view/film-card.js";
import UserRank from "./view/user-rank.js";
import ShowMoreBtnView from "./view/show-more-btn.js";
import ExtraSectionView from "./view/create-extra-section.js";
import PopupView from "./view/popup-film.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateUseRank} from "./mock/rank.js";

const MOCK_FILMS_COUNT = 20;
const MAX_FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;
const EXTRA_SECTION_COUNT = 2;

const siteMainContainer = document.querySelector(".main");
const siteHeader = document.querySelector(".header");
const siteFooter = document.querySelector(".footer");

const footerStat = siteFooter.querySelector(".footer__statistics");

/*const mockFilms = Array.from({length: MOCK_FILMS_COUNT}, generateFilm);*/
const mockFilms = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filmFilters = generateFilter(mockFilms);


console.log(mockFilms);


renderTemplate(siteMainContainer, new Menu(filmFilters).getElement(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainContainer, new SortView().getElement(), RenderPosition.BEFOREEND);
renderTemplate(siteHeader, new UserRank(generateUseRank()).getElement(), RenderPosition.BEFOREEND);
renderTemplate(siteFooter, new PopupView (mockFilms[0]).getElement(), RenderPosition.AFTERBEGIN);

footerStat.insertAdjacentHTML(RenderPosition.BEFOREEND, `<p>${MOCK_FILMS_COUNT} movies inside</p>`);

renderTemplate(siteMainContainer, new FilmListView().getElement(), RenderPosition.BEFOREEND);

const filmSection = siteMainContainer.querySelector(".films");
const filmList = filmSection.querySelector(".films-list");
const filmListContainer = filmList.querySelector(".films-list__container");

for (let i = 0; i <= Math.min(mockFilms.length, MAX_FILM_COUNT)-1; i++) {
    renderTemplate(filmListContainer, new FilmCardView(mockFilms[i]).getElement(), RenderPosition.BEFOREEND);
}


    
if(mockFilms.length > MAX_FILM_COUNT) {
    let filmsCounter = MAX_FILM_COUNT;
    
    renderTemplate(filmList, new ShowMoreBtnView().getElement(), RenderPosition.BEFOREEND);
    const showMoreBtn = filmList.querySelector(".films-list__show-more");
    
    showMoreBtn.addEventListener("click", () => {
        mockFilms.slice(filmsCounter, filmsCounter + MAX_FILM_COUNT)
            .forEach((film) => renderTemplate(filmListContainer, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));
    
        filmsCounter += MAX_FILM_COUNT;
    
        if(filmsCounter >= mockFilms.length) {
            showMoreBtn.remove();
        }      
    });
}

for (let i = 0; i < EXTRA_SECTION_COUNT; i++) {
    renderTemplate(filmSection, new ExtraSectionView().getElement(), RenderPosition.BEFOREEND);
}

const extraSection = siteMainContainer.querySelectorAll(".films-list--extra");
extraSection[0].classList.add("films-list--rate");
extraSection[1].classList.add("films-list--comment");

const ratedSection = siteMainContainer.querySelector(".films-list--rate");
const commentedSection = siteMainContainer.querySelector(".films-list--comment");

const ratedContainer = ratedSection.querySelector(".films-list__container");
const commentedContainer = commentedSection.querySelector(".films-list__container");


for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
    const sortedByRateFilms = mockFilms.slice().sort((a, b) => b.rate - a.rate);
    renderTemplate(ratedContainer, new FilmCardView(sortedByRateFilms[i]).getElement(), RenderPosition.BEFOREEND);
}

for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
    const sortedByCommentsFilms = mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length);
    renderTemplate(commentedContainer, new FilmCardView(sortedByCommentsFilms[i]).getElement(), RenderPosition.BEFOREEND);        
}

commentedSection.insertAdjacentHTML(RenderPosition.AFTERBEGIN, "<h2 class=\"films-list__title\">Most commented</h2>");
ratedSection.insertAdjacentHTML(RenderPosition.AFTERBEGIN, "<h2 class=\"films-list__title\">Top rated</h2>");


const popupContainer = document.querySelector(".film-details");
const exitPopupBtn = popupContainer.querySelector(".film-details__close-btn");



exitPopupBtn.addEventListener("click", ()=> {
    popupContainer.remove();
});



export {filmFilters, mockFilms};
