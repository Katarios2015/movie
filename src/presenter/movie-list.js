import FilmListView from "../view/film-list.js";
import EmptyFilmListView from "../view/empty-list.js";
import ShowMoreBtnView from "../view/show-more-btn.js";
import ExtraSectionView from "../view/create-extra-section.js";

import MoviePresenter from "./movie.js";
import {render, RenderPosition, remove} from "../render.js";

import {updateItem} from "../mock/util.js";

const MAX_FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;

export default class MovieList {
    constructor(siteContainer, siteBody) {
        this._siteMainContainer = siteContainer;
        this._siteBodyContainer = siteBody;
        this._renderedFilmsCounter = MAX_FILM_COUNT;

        this._moviePresenter = {};
        
        this._filmListComponent = new FilmListView();
        //this._menuComponent = new MenuView();
        /*this._sortComponent = new SortView();*/
        this._showMoreBtnComponent = new ShowMoreBtnView();
        this._EmptyFilmListComponent = new EmptyFilmListView();
        this._ExtraSectionComponent = new ExtraSectionView();

        this._handleShowMoreBtnButton = this._handleShowMoreBtnButton.bind(this);
        this._renderExtraSection = this._renderExtraSection.bind(this);

        this._handleMovieChange = this._handleMovieChange.bind(this);
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


    _renderMovieCards(from, to, container, dataArray) {
        dataArray
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
        // Метод, куда уйдёт логика по отрисовке компонетов карточек фильма,
        // текущая функция renderTask в main.js
        render(this._filmListComponent.getElement().querySelector(".films-list"), this._showMoreBtnComponent, RenderPosition.BEFOREEND);
        this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnButton);
    }

    _handleMovieChange(updatedMovie) {
        this._mockFilms = updateItem(this._mockFilms, updatedMovie);
        this._moviePresenter[updatedMovie.id].init(updatedMovie);
    } //- Опишем в презентере списка фильмов обработчик изменений в карточке фильма - _handleMovieChange
    //- После обновления данных повторно инициализируем Movie-презентер уже с новыми данными

    _renderFilmCard(filmContainer, filmData) {
        const moviePresenter = new MoviePresenter(this._siteBodyContainer, this._handleMovieChange);
        //Передадим функцию обновления из презентера списка в презентер карточки фильма
        moviePresenter.init(filmContainer, filmData);
        
        this._moviePresenter[filmData.id] = moviePresenter;
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
            render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);

            this._renderMovieCards(0, Math.min(this._mockFilms.length, MAX_FILM_COUNT), this._filmListComponent.getElement()
                .querySelector(".films-list__container"), this._mockFilms);

            if(this._mockFilms.length > MAX_FILM_COUNT) {
                this._renderShowMoreBtnButton();
            }

            this._renderExtraSection();
        }
    }

    _clearMovieList() {
        Object
            .values( this._moviePresenter)
            .forEach((presenter) => presenter.destroy());
        this._moviePresenter = {};
        this._renderedFilmsCounter = MAX_FILM_COUNT;
        remove(this._showMoreBtnComponent);
    }

}