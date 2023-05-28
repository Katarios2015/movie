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

        //this._showedMovieControllers = [];

        this._ratedComponent = null;
        this._commentsComponent = null;

        this._renderedFilter = filter;


        this._moviePresenter = {};
        this._moviePresenterExtra = {};

        this._currentSortType = SortType.DEFAULT;

        this._menuComponent = new MenuView(filter);
        this._filmListComponent = new FilmListView();

        this._sortComponent = new SortView();
        this._showMoreBtnComponent = new ShowMoreBtnView();
        this._EmptyFilmListComponent = new EmptyFilmListView();
        
        this._handleShowMoreBtnButton = this._handleShowMoreBtnButton.bind(this);
        this._renderExtraSection = this._renderExtraSection.bind(this);
        this._handleModeChange = this._handleModeChange.bind(this);//режим просмотра или редактирования
        this._handleModeChangeExtra = this._handleModeChangeExtra.bind(this);
        this._handleMovieChange = this._handleMovieChange.bind(this);
        this._handleMovieExtraChange = this._handleMovieExtraChange.bind(this);
        this._handleSortTypeChange = this._handleSortTypeChange.bind(this);//сортировка

    }

    init(mockFilms) {
        this._mockFilms = mockFilms.slice();
        // 1. В отличии от сортировки по любому параметру,
        // исходный порядок можно сохранить только одним способом -
        // сохранив исходный массив:
        this._sourcedMovies = mockFilms.slice();
        this._sourcedMoviesTwo = mockFilms.slice();
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

    _handleModeChangeExtra() {
        Object
            .values(this._moviePresenterExtra)
            .forEach((presenter) => {
                presenter.resetView();
                console.log(presenter);});
    }

    _handleMovieChange(filmContainer, updatedMovie) {
        this._mockFilms = updateItem(this._mockFilms, updatedMovie);
        this._moviePresenter[updatedMovie.id].init(filmContainer, updatedMovie);

        this._sourcedMovies = updateItem(this._sourcedMovies, updatedMovie);
        console.log(this._sourcedMovies);
    }

    _handleMovieExtraChange(filmContainer, updatedMovie) {
        this._mockFilms = updateItem(this._mockFilms, updatedMovie);
        console.log(this._mockFilms);
        this._moviePresenterExtra[updatedMovie.id].init(filmContainer, updatedMovie);
        this._sourcedMoviesTwo = updateItem(this._sourcedMoviesTwo, updatedMovie);
        

        
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


    _handleSortTypeChange(sortType) {
        if (this._currentSortType ===  sortType) {
            return;
        }      

        this._sortMovies(sortType);
    

        this._clearMovieList(true);
        this._clearRatedFilms();
        this._clearCommentedFilms();

        this._renderMovieList();
        
    }


    _renderFilmCard(filmContainer, filmData) {
        const moviePresenter = new MoviePresenter(this._siteBodyContainer, this._handleMovieChange,  this._handleModeChange);
        moviePresenter.init(filmContainer, filmData);
        this._moviePresenter[filmData.id] = moviePresenter;
    }

    _renderFilmCardExtra(filmContainer, filmData) {
        
        const moviePresenterExtra = new MoviePresenter(this._siteBodyContainer, this._handleMovieExtraChange,  this._handleModeChangeExtra);
        moviePresenterExtra.init(filmContainer, filmData);
        this._moviePresenterExtra[filmData.id] = moviePresenterExtra;
       
    }

    _renderMovieCards(from, to, container, dataArray) {
        dataArray
            .slice(from, to)
            .forEach((filmCard) => {
                this._renderFilmCard(container, filmCard);
            });
        return dataArray;       
    }

    _renderExtraMovieCards(from, to, container, dataArray) {
        dataArray
            .slice(from, to)
            .forEach((filmCard) => {
                this._renderFilmCardExtra(container, filmCard);
            });
        return dataArray;       
    }

    _renderMovieList() {
        if (this._mockFilms.length === 0) {
            this._renderEmptyFilmList();
        } else {
            render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);

            this._renderMovieCards(0, Math.min(this._mockFilms.length, this._renderedFilmsCounter), 
                this._filmListComponent.getElement().querySelector(".films-list__container"), this._mockFilms, this._MainComponentS);

   

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
        const slicedFilms = this._mockFilms.slice();
        
        const sortedByRateFilms = slicedFilms.sort((a, b) => b.rate - a.rate).slice(0, FILM_EXTRA_COUNT);
        const sortedByCommentsFilms = slicedFilms.sort((a, b) => b.comments.length - a.comments.length).slice(0, FILM_EXTRA_COUNT);

       
        this._renderExtraMovieCards(0, FILM_EXTRA_COUNT, this._ratedComponent.getElement().querySelector(".films-list__container"), sortedByRateFilms);
        this._renderExtraMovieCards(0, FILM_EXTRA_COUNT, this._commentsComponent.getElement().querySelector(".films-list__container"), sortedByCommentsFilms);
    }

    
    
    _clearMovieList(resetRenderedFilmCount = false) {
        Object.values(this._moviePresenter).forEach((presenter) => {presenter.destroy();});
        remove(this._filmListComponent);

        this._moviePresenter = {};
        this._renderedFilmsCounter = MAX_FILM_COUNT;
        remove(this._showMoreBtnComponent);

        if (resetRenderedFilmCount) {
            this._renderedFilmsCounter = MAX_FILM_COUNT;
        } else {
            this._renderedFilmsCounter = Math.min(this._mockFilms.length, this._renderedFilmsCounter);
        }
    }

    _clearRatedFilms() {
        Object.values(this._moviePresenterExtra).forEach((presenter) => {presenter.destroy();});
        
        this._moviePresenterExtra = {};
        remove(this._ratedComponent);
    }

    _clearCommentedFilms() {
        Object.values(this._moviePresenterExtra).forEach((presenter) => {presenter.destroy();});
       
        this._moviePresenterExtra = {};

        remove(this._commentsComponent);
    }

}
