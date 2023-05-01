import FilmListView from "../view/film-list.js";
/*import SortView from "../view/sort.js";*/
//import MenuView from "../view/menu.js";
import EmptyFilmListView from "../view/empty-list.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreBtnView from "../view/show-more-btn.js";
import PopupView from "../view/popup-film.js";
import ExtraSectionView from "../view/create-extra-section.js";

import {renderTemplate, render, RenderPosition, remove} from "../render.js";

const MAX_FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;
const EXTRA_SECTION_COUNT = 2;

export default class MovieList {
    constructor(siteContainer, siteBody) {
        this._siteMainContainer = siteContainer;
        this._siteBodyContainer = siteBody;
        this._renderedFilmsCounter = MAX_FILM_COUNT;
        

        this._filmListComponent = new FilmListView();
        //this._menuComponent = new MenuView();
        /*this._sortComponent = new SortView();*/
        this._showMoreBtnComponent = new ShowMoreBtnView();
        this._EmptyFilmListComponent = new EmptyFilmListView();
        this._PopupComponent = new PopupView();
        this._ExtraSectionComponent = new ExtraSectionView();

        this._handleShowMoreBtnButton = this._handleShowMoreBtnButton.bind(this);
        this._renderExtraSection = this._renderExtraSection.bind(this);
    }

    init(mockFilms) {
        this._mockFilms = mockFilms.slice();
        // Метод для инициализации (начала работы) модуля,
        // малая часть текущей функции renderBoard в main.js
        render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);

        this._renderMovieList();
    }

    /*_renderSort() {
    // Метод для рендеринга сортировки
    }*/


    _renderMovieCards(from, to, container, sortedArray) {
        sortedArray
            .slice(from, to)
            .forEach((filmCard) => {
                this._renderFilmCard(container, filmCard);
            });
    }


    _renderEmptyFilmList() {
        // Метод для рендеринга заглушки
        render(this._siteMainContainer, this._EmptyFilmListComponent, RenderPosition.BEFOREEND);
    }

    _handleShowMoreBtnButton() {
        this._renderMovieCards(this._renderedFilmsCounter, this._renderedFilmsCounter + MAX_FILM_COUNT, 
            this._filmListComponent.getElement().querySelector(".films-list__container"), this._mockFilms);
        this._renderedFilmsCounter += MAX_FILM_COUNT;
        
        if(this._renderedFilmsCounter >= this._mockFilms.length) {
            remove(this._showMoreBtnComponent);
        }      
    }
    
    _renderShowMoreBtnButton() {
        // Метод, куда уйдёт логика по отрисовке компонетов задачи,
        // текущая функция renderTask в main.js
        render(this._filmListComponent.getElement().querySelector(".films-list"), this._showMoreBtnComponent, RenderPosition.BEFOREEND);
        this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnButton);
    }

    _renderFilmCard(filmContainer, filmData) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
        const filmCardComponent = new FilmCardView(filmData);
        const popupComponent = new PopupView(filmData);
    
        const onEscKeyDown = (evt) => {
            if (evt.key === "Escape" || evt.keyCode === 27) {
                evt.preventDefault();
                this._siteBodyContainer.removeChild(popupComponent.getElement());
                document.removeEventListener("keydown", onEscKeyDown);
                this._siteBodyContainer.classList.remove("hide-overflow");
            }
        };

        const showPopup = () => {
            this._siteBodyContainer.appendChild(popupComponent.getElement());
            this._siteBodyContainer.classList.add("hide-overflow");
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
            this._siteBodyContainer.removeChild(popupComponent.getElement());
            this._siteBodyContainer.classList.remove("hide-overflow");
        });
   
   
        render(filmContainer, filmCardComponent, RenderPosition.BEFOREEND);
    }

 
    _renderExtraSection () {
        
        render(this._filmListComponent, this._ExtraSectionComponent, RenderPosition.BEFOREEND);

        const ratedSection = this._filmListComponent.getElement().querySelector(".films-list--rate");
        const commentedSection = ratedSection.cloneNode(true);
        commentedSection.className = ("films-list films-list--extra films-list--comment");

        render(this._filmListComponent, commentedSection, RenderPosition.BEFOREEND);
        commentedSection.querySelector("h2").innerHTML = "Most commented";
        const sortedByRateFilms = this._mockFilms.slice().sort((a, b) => b.rate - a.rate);
        const sortedByCommentsFilms = this._mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length);

        this._renderMovieCards(0, FILM_EXTRA_COUNT, ratedSection.querySelector(".films-list__container"), sortedByRateFilms);
        this._renderMovieCards(0, FILM_EXTRA_COUNT, commentedSection.querySelector(".films-list__container"), sortedByCommentsFilms);
    }

    

    _renderMovieList() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей реализации в main.js
        if (this._mockFilms.length === 0) {
            this._renderEmptyFilmList();
        } else {
            render(this._siteMainContainer,  this._filmListComponent, RenderPosition.BEFOREEND);

            this._renderMovieCards(0, Math.min(this._mockFilms.length, MAX_FILM_COUNT), this._filmListComponent.getElement()
                .querySelector(".films-list__container"), this._mockFilms);

            if(this._mockFilms.length > MAX_FILM_COUNT) {
                this._renderShowMoreBtnButton();
            }

            this._renderExtraSection();
        }
    
    }
}