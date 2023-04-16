import {render} from "./render.js";
import {createMenuTemplate} from "./view/menu-sort-filter.js";
import {createFilmCardTemplate,createFilmListSectionTemplate} from "./view/film-card.js";
import {createUserRankTemplate} from "./view/user-rank.js";
import {createExtraSectionTemplate} from "./view/create-extra-section.js";
import {createPopupTemplate} from "./view/popup-film.js";
import {createShowMoreBtnTemplate} from "./view/show-more-btn.js";
import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateUseRank} from "./mock/rank.js";
/*import {getTopRatedFilms, getTopComentedFilms} from "./mock/extra-films.js";*/

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


render(siteMainContainer, createMenuTemplate(filmFilters), "afterbegin");
render(siteHeader, createUserRankTemplate(generateUseRank()), "beforeend");
render(siteFooter, createPopupTemplate(mockFilms[0]), "afterend");

render(footerStat, `<p>${MOCK_FILMS_COUNT} movies inside</p>`, "beforeend");

render(siteMainContainer, createFilmListSectionTemplate(), "beforeend");
const filmSection = siteMainContainer.querySelector(".films");

const filmList = filmSection.querySelector(".films-list");
const filmListContainer = filmList.querySelector(".films-list__container");

const generateFilmlist = () => {
    for (let i = 0; i <= Math.min(mockFilms.length, MAX_FILM_COUNT)-1; i++) {
        render(filmListContainer, createFilmCardTemplate(mockFilms[i]), "beforeend");
    }
    
    
    if(mockFilms.length > MAX_FILM_COUNT) {
        let filmsCounter = MAX_FILM_COUNT;
    
        render(filmList, createShowMoreBtnTemplate(), "beforeend");
        const showMoreBtn = filmList.querySelector(".films-list__show-more");
    
        showMoreBtn.addEventListener("click", () => {
            mockFilms.slice(filmsCounter, filmsCounter + MAX_FILM_COUNT)
                .forEach((film) => render(filmListContainer, createFilmCardTemplate(film), "beforeend"));
    
            filmsCounter += MAX_FILM_COUNT;
    
            if(filmsCounter >= mockFilms.length) {
                showMoreBtn.remove();
            }      
        });
    }
};

generateFilmlist();


for (let i = 0; i < EXTRA_SECTION_COUNT; i++) {
    render(filmSection, createExtraSectionTemplate(), "beforeend");
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
    render(ratedContainer, createFilmCardTemplate(sortedByRateFilms[i]), "beforeend");
}

for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
    const sortedByCommentsFilms = mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length);
    render(commentedContainer, createFilmCardTemplate(sortedByCommentsFilms[i]), "beforeend");        
}

render(commentedSection, "<h2 class=\"films-list__title\">Most commented</h2>", "afterbegin");
render(ratedSection, "<h2 class=\"films-list__title\">Top rated</h2>", "afterbegin");


const popupContainer = document.querySelector(".film-details");
const exitPopupBtn = popupContainer.querySelector(".film-details__close-btn");

exitPopupBtn.addEventListener("click", ()=> {
    popupContainer.remove();
});

