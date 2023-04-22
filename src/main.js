import {renderTemplate, render, RenderPosition} from "./render.js";
import Menu from "./view/menu.js";
import SortView from "./view/sort.js";
import FilmListView from "./view/film-list.js";

import FilmCardView from "./view/film-card.js";
import UserRank from "./view/user-rank.js";
import ShowMoreBtnView from "./view/show-more-btn.js";
import ExtraSectionView from "./view/create-extra-section.js";
import PopupView from "./view/popup-film.js";
import EmptyFilmList from "./view/empty-list.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateUseRank} from "./mock/rank.js";

const MOCK_FILMS_COUNT = 20;
const MAX_FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;
const EXTRA_SECTION_COUNT = 2;


const siteBody = document.querySelector("body");
const siteMainContainer = document.querySelector(".main");
const siteHeader = document.querySelector(".header");
const siteFooter = document.querySelector(".footer");

const footerStat = siteFooter.querySelector(".footer__statistics");

/*const mockFilms = Array.from({length: MOCK_FILMS_COUNT}, generateFilm);*/
const mockFilms = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filmFilters = generateFilter(mockFilms);


console.log(mockFilms);


render(siteMainContainer, new Menu(filmFilters).getElement(), RenderPosition.AFTERBEGIN);
render(siteMainContainer, new SortView().getElement(), RenderPosition.BEFOREEND);
render(siteHeader, new UserRank(generateUseRank()).getElement(), RenderPosition.BEFOREEND);
//render(siteFooter, new PopupView (mockFilms[0]).getElement(), RenderPosition.AFTERBEGIN);

renderTemplate (footerStat, `<p>${MOCK_FILMS_COUNT} movies inside</p>`, RenderPosition.BEFOREEND);

if(mockFilms.length === 0) {
    render(siteMainContainer, new EmptyFilmList().getElement(), RenderPosition.BEFOREEND);
} else {
    render(siteMainContainer, new FilmListView().getElement(), RenderPosition.BEFOREEND);

    const filmSection = siteMainContainer.querySelector(".films");
    const filmList = filmSection.querySelector(".films-list");
    const filmListContainer = filmList.querySelector(".films-list__container");

    const renderFilmCards = (filmListContainer, film) => {
        const filmCardComponent = new FilmCardView(film);
        const popupComponent = new PopupView(film).getElement();

        const posterFilmCard = filmCardComponent.getElement().querySelector(".film-card__poster");
        const titleFilmCard = filmCardComponent.getElement().querySelector(".film-card__title");
        const commentsCount = filmCardComponent.getElement().querySelector(".film-card__comments");
        const exitPopupBtn = popupComponent.querySelector(".film-details__close-btn");
    
        const onEscKeyDown = (evt) => {
            if(evt.key === "Escape" || evt.keyCode === 27){
                evt.preventDefault();
                siteBody.removeChild(popupComponent);
                document.removeEventListener("keydown", onEscKeyDown);
                siteBody.classList.remove("hide-overflow");
            }
        };

        const showPopup = () => {
            siteBody.appendChild(popupComponent);
            siteBody.classList.add("hide-overflow");
            document.addEventListener("keydown", onEscKeyDown);
        };
    

        posterFilmCard.addEventListener("click", () => {
            showPopup();
        });

        titleFilmCard.addEventListener("mousemove", () => {
            titleFilmCard.style.cursor = "pointer";
        });

        titleFilmCard.addEventListener("click", () => {
            showPopup();
        });

        commentsCount.addEventListener("click", () => {
            showPopup();
            
        });
    
        exitPopupBtn.addEventListener("click", () => {
            siteBody.removeChild(popupComponent);
            siteBody.classList.remove("hide-overflow");
        });
        render(filmListContainer, filmCardComponent.getElement(), RenderPosition.BEFOREEND);

    };



    for (let i = 0; i <= Math.min(mockFilms.length, MAX_FILM_COUNT)-1; i++) {
        renderFilmCards(filmListContainer, mockFilms[i]);
    }
  
    if(mockFilms.length > MAX_FILM_COUNT) {
        let filmsCounter = MAX_FILM_COUNT;
    
        render(filmList, new ShowMoreBtnView().getElement(), RenderPosition.BEFOREEND);
        const showMoreBtn = filmList.querySelector(".films-list__show-more");
    
        showMoreBtn.addEventListener("click", () => {
            mockFilms.slice(filmsCounter, filmsCounter + MAX_FILM_COUNT)
                .forEach((film) => renderFilmCards(filmListContainer, film));
    
            filmsCounter += MAX_FILM_COUNT;
    
            if(filmsCounter >= mockFilms.length) {
                showMoreBtn.remove();
            }      
        });
    }

    for (let i = 0; i < EXTRA_SECTION_COUNT; i++) {
        render(filmSection, new ExtraSectionView().getElement(), RenderPosition.BEFOREEND);
    }
    
    const extraSections = siteMainContainer.querySelectorAll(".films-list--extra");
    extraSections[0].classList.add("films-list--rate");
    extraSections[1].classList.add("films-list--comment");
    
    const ratedSection = siteMainContainer.querySelector(".films-list--rate");
    const commentedSection = siteMainContainer.querySelector(".films-list--comment");
    
    const ratedContainer = ratedSection.querySelector(".films-list__container");
    const commentedContainer = commentedSection.querySelector(".films-list__container");
    
    
    for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
        const sortedByRateFilms = mockFilms.slice().sort((a, b) => b.rate - a.rate);
        render(ratedContainer, new FilmCardView(sortedByRateFilms[i]).getElement(), RenderPosition.BEFOREEND);
    }
    
    for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
        const sortedByCommentsFilms = mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length);
        render(commentedContainer, new FilmCardView(sortedByCommentsFilms[i]).getElement(), RenderPosition.BEFOREEND);        
    }
    
    renderTemplate(commentedSection, "<h2 class=\"films-list__title\">Most commented</h2>", RenderPosition.AFTERBEGIN );
    renderTemplate(ratedSection, "<h2 class=\"films-list__title\">Top rated</h2>", RenderPosition.AFTERBEGIN);
}









export {filmFilters, mockFilms};
