import FilmListView from "../view/film-list.js";
import EmptyFilmListView from "../view/empty-list.js";
import ShowMoreBtnView from "../view/show-more-btn.js";
import ExtraSectionView from "../view/create-extra-section.js";
import MenuView from "../view/menu.js";
import SortView from "../view/sort.js";

import {sortMovieDate, sortMovieRate, render, RenderPosition, remove} from "../utils/render.js";
import {updateItem,ExtraTitle, SortType} from "../utils/common.js";

import MoviePresenter from "./movie.js";

const MAX_FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;

export default class MovieList {
    constructor(siteContainer, siteBody, filter) {
        this._siteMainContainer = siteContainer;
        this._siteBodyContainer = siteBody;
        this._renderedFilmsCounter = MAX_FILM_COUNT;

        this._showedMovieControllers = [];

        this._ratedComponent = {};
        this._commentsComponent = {};

        this._renderedFilter = filter;

        this._moviePresenter = {};

        this._currentSortType = SortType.DEFAULT;

        this._menuComponent = new MenuView(filter);
        this._filmListComponent = new FilmListView();

        this._sortComponent = new SortView();
        this._showMoreBtnComponent = new ShowMoreBtnView();
        this._EmptyFilmListComponent = new EmptyFilmListView();
        
        //this._ExtraSectionComponent = new ExtraSectionView();

        this._handleShowMoreBtnButton = this._handleShowMoreBtnButton.bind(this);
        this._renderExtraSection = this._renderExtraSection.bind(this);
        this._handleModeChange = this._handleModeChange.bind(this);//режим просмотра или редактирования

        this._handleMovieChange = this._handleMovieChange.bind(this);
        this._handleSortTypeChange = this._handleSortTypeChange.bind(this);//сортировка
    }

    init(mockFilms) {
        this._mockFilms = mockFilms.slice();
        // 1. В отличии от сортировки по любому параметру,
        // исходный порядок можно сохранить только одним способом -
        // сохранив исходный массив:
        this._sourcedMovies = mockFilms.slice();
        render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);
        this._renderMovieList();
        this._renderSort();
        this._renderMenu();
    }

    _renderSort() {
        render(this._filmListComponent, this._sortComponent, RenderPosition.BEFORE);
        this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    }

    _renderMenu() {
        render(this._siteMainContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
    }


    _renderEmptyFilmList() {
        render(this._siteMainContainer, this._EmptyFilmListComponent, RenderPosition.BEFOREEND);
    }

    _handleModeChange() {
        Object
            .values(this._moviePresenter)
            .forEach((presenter) => {
                presenter.resetView();
                console.log(presenter);});
    }

    _handleMovieChange(filmContainer, updatedMovie) {
        this._mockFilms = updateItem(this._mockFilms, updatedMovie);
        this._moviePresenter[updatedMovie.id].init(filmContainer, updatedMovie);

        this._sourcedMovies = updateItem(this._sourcedMovies, updatedMovie);
    }

    _sortMovies(sortType) {
        // 2. Этот исходный массив задач необходим,
        // потому что для сортировки мы будем мутировать
        // массив в свойстве _boardTasks
        switch (sortType) {
        case SortType.DATE:
            this._mockFilms.sort(sortMovieDate);
            break;
        case SortType.RATE:
            this._mockFilms.sort(sortMovieRate);
            break;
        default:
            // 3. А когда пользователь захочет "вернуть всё, как было",
            // мы просто запишем в исходный массив
            this._mockFilms = this._sourcedMovies.slice();
        }
    
        this._currentSortType = sortType;
    }


    _handleSortTypeChange() {
        /* if (this._currentSortType === sortType) {
            return;
        }*/

        //this._sortMovies(sortType);
        //debugger;
        this._clearMovieList();
        //this._clearRatedFilms();
        //this._clearCommentedFilms();

        //this._renderMovieList();
        
        
    }

    _renderFilmCard(filmContainer, filmData) {
        const moviePresenter = new MoviePresenter(this._siteBodyContainer, this._handleMovieChange,  this._handleModeChange);
        moviePresenter.init(filmContainer, filmData);
        this._moviePresenter[filmData.id] = moviePresenter;
    }

    _renderMovieCards(from, to, container, dataArray) {
        dataArray
            .slice(from, to)
            .forEach((filmCard) => {
                this._renderFilmCard(container, filmCard);
            });
        return dataArray;       
    }

    _renderMovieList() {
        if (this._mockFilms.length === 0) {
            this._renderEmptyFilmList();
        } else {
            render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);

            const arr = this._renderMovieCards(0, Math.min(this._mockFilms.length, this._renderedFilmsCounter), 
                this._filmListComponent.getElement().querySelector(".films-list__container"), this._mockFilms);

                console.log(arr);


            if(this._mockFilms.length > MAX_FILM_COUNT) {
                this._renderShowMoreBtnButton();
            }
            this._renderExtraSection();
        }
    }

    _renderShowMoreBtnButton() {
        render(this._filmListComponent.getElement().querySelector(".films-list"), this._showMoreBtnComponent, RenderPosition.BEFOREEND);
        this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnButton);
    }

    _handleShowMoreBtnButton() {
        this._renderMovieCards(this._renderedFilmsCounter, this._renderedFilmsCounter + MAX_FILM_COUNT,
            this._filmListComponent.getElement().querySelector(".films-list__container"), this._mockFilms);
        this._renderedFilmsCounter += MAX_FILM_COUNT;

        if(this._renderedFilmsCounter >= this._mockFilms.length) {
            remove(this._showMoreBtnComponent);
        }
    }

    _renderExtraSection () {

        this._ratedComponent =  new ExtraSectionView(ExtraTitle.RATED);
        this._commentsComponent =  new ExtraSectionView(ExtraTitle.COMMENTED);
        
        render(this._filmListComponent, this._ratedComponent, RenderPosition.BEFOREEND);
        render(this._filmListComponent, this._commentsComponent, RenderPosition.BEFOREEND);

        
        this._commentsComponent.getElement().className = ("films-list films-list--extra films-list--comment");
        this._ratedComponent.getElement().className = ("films-list films-list--extra films-list--rate");


        const sortedByRateFilms = this._mockFilms.slice().sort((a, b) => b.rate - a.rate);
        const sortedByCommentsFilms = this._mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length);

        this._renderMovieCards(0, FILM_EXTRA_COUNT, this._ratedComponent.getElement().querySelector(".films-list__container"), sortedByRateFilms);
        this._renderMovieCards(0, FILM_EXTRA_COUNT, this._commentsComponent.getElement().querySelector(".films-list__container"), sortedByCommentsFilms);
    }


    _clearMovieList() {

        const movies = Object.values(this._moviePresenter);
    
        //const movierated = Object.values(this._ratedComponent);
        //const movieCommented = Object.values(this._commentsComponent);

        //console.log(movierated);
        //console.log(movieCommented);
        this._showedMovieControllers.forEach((movie) => console.log(movie));
        //Object.values(this._moviePresenter).forEach((presenter) => {presenter.destroy();});
        //this._moviePresenter = {};
        //this._renderedFilmsCounter = MAX_FILM_COUNT;
        
        //remove(this._showMoreBtnComponent);
    }

    _clearRatedFilms() {
        remove(this._ratedComponent);
    }

    _clearCommentedFilms() {
        remove(this._commentsComponent);
    }

}
