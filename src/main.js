import {renderTemplate, render, RenderPosition, remove} from "./render.js";
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


render(siteMainContainer, new Menu(filmFilters), RenderPosition.AFTERBEGIN);
render(siteMainContainer, new SortView(), RenderPosition.BEFOREEND);
render(siteHeader, new UserRank(generateUseRank()), RenderPosition.BEFOREEND);


renderTemplate (footerStat, `<p>${MOCK_FILMS_COUNT} movies inside</p>`, RenderPosition.BEFOREEND);

if (mockFilms.length === 0) {
    render(siteMainContainer, new EmptyFilmList(), RenderPosition.BEFOREEND);
} else {
    const filmListComponent = new FilmListView();
    render(siteMainContainer, filmListComponent, RenderPosition.BEFOREEND);

    const filmList = filmListComponent.getElement().querySelector(".films-list");
    const filmListContainer = filmListComponent.getElement().querySelector(".films-list__container");

    const renderFilmCards = (filmContainer, filmData) => {
        const filmCardComponent = new FilmCardView(filmData);
        const popupComponent = new PopupView(filmData);
    
        const onEscKeyDown = (evt) => {
            if (evt.key === "Escape" || evt.keyCode === 27) {
                evt.preventDefault();
                siteBody.removeChild(popupComponent.getElement());
                document.removeEventListener("keydown", onEscKeyDown);
                siteBody.classList.remove("hide-overflow");
            }
        };

        const showPopup = () => {
            siteBody.appendChild(popupComponent.getElement());
            siteBody.classList.add("hide-overflow");
            document.addEventListener("keydown", onEscKeyDown);
        };
    

        filmCardComponent.setPosterClickHandler(() => {
            showPopup();
        });

        filmCardComponent.setTitleMoveHandler(() => {
            filmCardComponent.getElement().querySelector(".film-card__title").style.cursor = "pointer";
        });

        filmCardComponent.setTitleClickHandler(() => {
            showPopup();
        });

        filmCardComponent.setCommentsClickHandler(() => {
            showPopup();
            
        });
    
        popupComponent.setExitBtnClickHandler(() => {
            siteBody.removeChild(popupComponent.getElement());
            siteBody.classList.remove("hide-overflow");
        });
   
   
        render(filmContainer, filmCardComponent, RenderPosition.BEFOREEND);

    };



    for (let i = 0; i <= Math.min(mockFilms.length, MAX_FILM_COUNT) - 1; i++) {
        renderFilmCards(filmListContainer, mockFilms[i]);
    }
  
    if(mockFilms.length > MAX_FILM_COUNT) {
        let filmsCounter = MAX_FILM_COUNT;
    
        const showMoreBtnComponent = new ShowMoreBtnView();

        render(filmList, showMoreBtnComponent, RenderPosition.BEFOREEND);
        
        showMoreBtnComponent.setClickHandler(() => {
            mockFilms.slice(filmsCounter, filmsCounter + MAX_FILM_COUNT)
                .forEach((film) => renderFilmCards(filmListContainer, film));
    
            filmsCounter += MAX_FILM_COUNT;
    
            if(filmsCounter >= mockFilms.length) {
                remove(showMoreBtnComponent);
            }      
        }) ;
    }

    for (let i = 0; i < EXTRA_SECTION_COUNT; i++) {
        const extraSectionComponent = new ExtraSectionView();
        

        render(filmListComponent, extraSectionComponent, RenderPosition.BEFOREEND);
    }
    
    const extraSections = filmListComponent.getElement().querySelectorAll(".films-list--extra");
    extraSections[0].classList.add("films-list--rate");
    extraSections[1].classList.add("films-list--comment");
    
    const ratedSection = filmListComponent.getElement().querySelector(".films-list--rate");
    const commentedSection = filmListComponent.getElement().querySelector(".films-list--comment");
    
    const ratedContainer = ratedSection.querySelector(".films-list__container");
    const commentedContainer = commentedSection.querySelector(".films-list__container");
    
    
    for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
        const sortedByRateFilms = mockFilms.slice().sort((a, b) => b.rate - a.rate);
        renderFilmCards(ratedContainer, sortedByRateFilms[i]);
    }
    
    for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
        const sortedByCommentsFilms = mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length);
        renderFilmCards(commentedContainer, sortedByCommentsFilms[i]); 
    }

    
    
    renderTemplate(commentedSection, "<h2 class=\"films-list__title\">Most commented</h2>", RenderPosition.AFTERBEGIN );
    renderTemplate(ratedSection, "<h2 class=\"films-list__title\">Top rated</h2>", RenderPosition.AFTERBEGIN);
}
