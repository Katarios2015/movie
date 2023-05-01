import FilmListView from "../view/film-list.js";
/*import SortView from "../view/sort.js";*/
import MenuView from "../view/menu.js";
import EmptyFilmListView from "../view/empty-list.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreBtnView from "./view/show-more-btn.js";
import {renderTemplate, render, RenderPosition, remove} from "./render.js";
import PopupView from "../view/popup-film.js";
import ExtraSectionView from "../view/create-extra-section.js";

const MAX_FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;
const EXTRA_SECTION_COUNT = 2;

export default class MovieList {
    constructor(siteContainer, siteBody) {
        this._siteMainContainer = siteContainer;
        this._siteBodyContainer = siteBody;
        this._renderedFilmsCounter = MAX_FILM_COUNT;      

        this._filmListComponent = new FilmListView();
        this._menuComponent = new MenuView();
        /*this._sortComponent = new SortView();*/
        this._showMoreBtnComponent = new ShowMoreBtnView();
        this._EmptyFilmListComponent = new EmptyFilmListView();
        this._PopupComponent = new PopupView();
        this._ExtraSectionComponent = new ExtraSectionView();

        this._handleShowMoreBtnButton = this._handleShowMoreBtnButton.bind(this);

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

    _renderMovieCards(from, to) {
        // Метод для рендеринга N-film за раз
        const filmListContainer =  this._filmListComponent.getElement().querySelector(".films-list__container");  
        this._mockFilms
            .slice(from, to)
            .forEach((filmCard) => this._renderFilmCard(filmListContainer, filmCard));
    }

    _renderEmptyFilmList() {
        // Метод для рендеринга заглушки
        render(this._siteMainContainer, this._EmptyFilmListComponent, RenderPosition.BEFOREEND);
    }

    _handleShowMoreBtnButton() {
        this._renderMovieCards(this._renderedFilmsCounter, this._renderedFilmsCounter + MAX_FILM_COUNT);
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

        for (let i = 0; i < EXTRA_SECTION_COUNT; i++) {
   
            render(this._filmListComponent, this._ExtraSectionComponent, RenderPosition.BEFOREEND);
        }
    
        const extraSections = this._filmListComponent.getElement().querySelectorAll(".films-list--extra");
        extraSections[0].classList.add("films-list--rate");
        extraSections[1].classList.add("films-list--comment");
    
        const ratedSection = this._filmListComponent.getElement().querySelector(".films-list--rate");
        const commentedSection = this._filmListComponent.getElement().querySelector(".films-list--comment");
    
        const ratedContainer = ratedSection.querySelector(".films-list__container");
        const commentedContainer = commentedSection.querySelector(".films-list__container");
    
    
        for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
            const sortedByRateFilms = this._mockFilms.slice().sort((a, b) => b.rate - a.rate);
            this._renderFilmCard(ratedContainer, sortedByRateFilms[i]);
        }
    
        for (let i = 0; i < FILM_EXTRA_COUNT; i++) {
            const sortedByCommentsFilms = this._mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length);
            this._renderFilmCard(commentedContainer, sortedByCommentsFilms[i]); 
        }
          
        renderTemplate(commentedSection, "<h2 class=\"films-list__title\">Most commented</h2>", RenderPosition.AFTERBEGIN );
        renderTemplate(ratedSection, "<h2 class=\"films-list__title\">Top rated</h2>", RenderPosition.AFTERBEGIN);

    }

    

    _renderMovieList() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей реализации в main.js
        if (this._mockFilms.length === 0) {
            this._renderEmptyFilmList();
        } else {
            render(this._siteMainContainer,  this._filmListComponent, RenderPosition.BEFOREEND);//перенос

            this._renderMovieCards(0, Math.min(this._mockFilms.length, MAX_FILM_COUNT));

            if(this._mockFilms.length > MAX_FILM_COUNT) {
                this._renderShowMoreBtnButton();
            }

            this._renderExtraSection();
        }
    
    }
}