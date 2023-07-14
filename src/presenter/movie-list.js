import FilmListView from "../view/film-list.js";
import EmptyFilmListView from "../view/empty-list.js";
import ShowMoreBtnView from "../view/show-more-btn.js";
import ExtraSectionView from "../view/create-extra-section.js";
import {siteFilterMap} from "../utils/filter.js";
import SortView from "../view/sort.js";
import LoadView from "../view/loading.js";
import {UserAction, UpdateType, SortType, ExtraTitle} from "../utils/constants.js";
import {sortMovieDate, sortMovieRate, render, RenderPosition, remove} from "../utils/render.js";

import MoviePresenter from "./movie.js";

const MAX_FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;


export default class MovieList {
    constructor(siteContainer, siteBody, moviesModel, commentsModel, filterModel, api) {
        this._moviesModel = moviesModel;
        this._commentsModel = commentsModel;
        this._filterModel = filterModel;
        this._api = api;

        this._siteMainContainer = siteContainer;
        this._siteBodyContainer = siteBody;
        this._renderedFilmsCounter = MAX_FILM_COUNT;

        this._isLoading = true;
        this._ratedComponent = null;
        this._commentsComponent = null;
        this._loadComponent = new LoadView();

        this._moviePresenter = {};
        this._moviePresenterExtra = {};

        this._currentSortType = SortType.DEFAULT;
        this._filmListComponent = new FilmListView();

        this._sortComponent = null;
        this._showMoreBtnComponent = null;      
        
        this._handleShowMoreBtn = this._handleShowMoreBtn.bind(this);
        this._renderExtraSection = this._renderExtraSection.bind(this);
        this._handleModeChange = this._handleModeChange.bind(this);//режим просмотра или редактирования
        this._handleModeChangeExtra = this._handleModeChangeExtra.bind(this);
        //this._handleMovieChange = this._handleMovieChange.bind(this);
        //this._handleMovieExtraChange = this._handleMovieExtraChange.bind(this);
        this._handleSortTypeChange = this._handleSortTypeChange.bind(this);//сортировка

        this._handleViewAction = this._handleViewAction.bind(this);
        this._handleModelEvent = this._handleModelEvent.bind(this);       
    }

    init() {
        /*this._mockFilms = mockFilms.slice();
        // 1. В отличии от сортировки по любому параметру,
        // исходный порядок можно сохранить только одним способом -
        // сохранив исходный массив:
        this._sourcedMovies = mockFilms.slice();
        this._sourcedMoviesTwo = mockFilms.slice();*/
        this._moviesModel.addObserver(this._handleModelEvent);
        this._filterModel.addObserver(this._handleModelEvent);

        render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);
        this._renderMovieList();
    }

    hide() {
        this._filmListComponent.getElement().classList.add("visually-hidden");
        this._sortComponent.getElement().classList.add("visually-hidden");
    }

    show() {
        this._filmListComponent.getElement().classList.remove("visually-hidden");
        this._sortComponent.getElement().classList.remove("visually-hidden");
    }

    destroy() {
        this._clearMovieList({resetRenderedFilmCount: true, resetSortType: true});
    
        remove(this._filmListComponent);
        //remove(this._EmptyFilmListComponent);
    
        this._moviesModel.removeObserver(this._handleModelEvent);
        this._filterModel.removeObserver(this._handleModelEvent);
    }

    _handleViewAction(actionType, updateType, update, movieId) {
        switch (actionType) {
        case UserAction.UPDATE_MOVIE:
            this._api.updateMovie(update).then((response) => {
                //console.log(response);
                this._moviesModel.updateMovie(updateType, response);
            });
            break;
        case UserAction.ADD_COMMENT:
            this._api.addComment(update, movieId).then((response) => {
                console.log(response);
                this._commentsModel.setComments(response.comments);
                this._moviesModel.updateMovie(updateType, response.movie);
            });
            break;
        case UserAction.DELETE_COMMENT:
            this._api.deleteComment(update).then(() => {
                this._commentsModel.deleteComment(updateType, update);
            });
            //при удалении комментариев возвращать с сервера нечего, остается update
            break;
        }
        // Здесь будем вызывать обновление модели.
        // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
        // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
        // update - обновленные данные
    }
    
    _handleModelEvent(updateType, data, filmContainer) {
        switch (updateType) {
        case UpdateType.PATCH:
            // - обновить часть списка (например, когда удалили/добавили коммент)
            this._moviePresenter[data.id].init(filmContainer, data);
            console.log(this._moviePresenter);
            console .log(this._commentsModel.getComments());
            //this._moviePresenterExtra[data.id].init(filmContainer, data); добвавить условие
            break;
        case UpdateType.MINOR:
            //console.log("отработал этот minor");
            this._clearMovieList();
            this._renderMovieList(); // - обновить список (без сброса сортировки и фильтров)*/
            
            break;
        case UpdateType.MAJOR:
            // - обновить весь список (например, при переключении фильтра),сбрасываем сортировку и фильтры
            this._clearMovieList({resetRenderedFilmCount: true, resetSortType: true});
            this._renderMovieList();
            break;
        case UpdateType.INIT:
            this._isLoading = false;
            remove(this._loadComponent);
            this._renderMovieList();
            break;
        }
       
    }

    _renderLoading() {
        render(this._filmListComponent, this._loadComponent, RenderPosition.AFTERBEGIN);
    }

    _getMovies() {
        const filterType = this._filterModel.getFilter();
        const movies = this._moviesModel.getMovies();
        //console.log("filterType " + filterType);
        const filtredMovies = siteFilterMap[filterType](movies);
        const slicedArray = filtredMovies.slice();
        switch (this._currentSortType) {
        case SortType.DATE:
            return filtredMovies.sort(sortMovieDate);
        case SortType.RATE:
            return filtredMovies.sort(sortMovieRate);
        //default:
        }
        return slicedArray;
    }

    _renderSort() {
        if (this._sortComponent !== null) {
            this._sortComponent = null;
        }
      
        this._sortComponent = new SortView(this._currentSortType);
        this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
        render(this._filmListComponent, this._sortComponent, RenderPosition.BEFORE);
        
    }

    /*_renderMenu() {
        render(this._siteMainContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
    }*/
    _renderEmptyFilmList() {
        this._EmptyFilmListComponent = new EmptyFilmListView(this._filterModel.getFilter());
        render(this._siteMainContainer, this._EmptyFilmListComponent, RenderPosition.BEFOREEND);
    }

    _handleModeChange() {
        Object
            .values(this._moviePresenter)
            .forEach((presenter) => {
                presenter.resetView();
            });
    }

    _handleModeChangeExtra() {
        Object
            .values(this._moviePresenterExtra)
            .forEach((presenter) => {
                presenter.resetView();
            });
    }

    /*_handleMovieChange(filmContainer, updatedMovie) {
        //this._mockFilms = updateItem(this._mockFilms, updatedMovie);
        this._moviePresenter[updatedMovie.id].init(filmContainer, updatedMovie);

        // Здесь будем вызывать обновление модели

        // this._sourcedMovies = updateItem(this._sourcedMovies, updatedMovie);
        console.log(this._sourcedMovies);
    }*/

    /*_handleMovieExtraChange(filmContainer, updatedMovie) {
        //this._mockFilms = updateItem(this._mockFilms, updatedMovie);
        //console.log(this._mockFilms);
        // Здесь будем вызывать обновление модели
        this._moviePresenterExtra[updatedMovie.id].init(filmContainer, updatedMovie);
        // this._sourcedMoviesTwo = updateItem(this._sourcedMoviesTwo, updatedMovie);
        
    }*/
    _handleSortTypeChange(sortType) {
        if (this._currentSortType ===  sortType) {
            return;
        }      
        //this._sortMovies(sortType);
        this._currentSortType = sortType;

        this._clearMovieList({resetRenderedFilmCount: true});
        this._renderMovieList();
    
        // this._clearRatedFilms();
        //this._clearCommentedFilms();
        //this._renderExtraSection();
    }

    _renderFilmCard(filmContainer, filmData) {
        const moviePresenter = new MoviePresenter(this._siteBodyContainer, 
            this._handleViewAction,  this._handleModeChange, this._commentsModel, this._api);
        moviePresenter.init(filmContainer, filmData);
        this._moviePresenter[filmData.id] = moviePresenter;
    }

    _renderFilmCardExtra(filmContainer, filmData) {
        const moviePresenterExtra = new MoviePresenter(this._siteBodyContainer, 
            this._handleViewAction,  this._handleModeChangeExtra, this._commentsModel, this._api);
        moviePresenterExtra.init(filmContainer, filmData);
        this._moviePresenterExtra[filmData.id] = moviePresenterExtra;
    }

    _renderMovieCards(container, dataArray) {
        dataArray.forEach((filmCard) => {
            this._renderFilmCard(container, filmCard);
        });
        return dataArray;       
    }

    _renderExtraMovieCards(container, dataArray) {
        dataArray.forEach((filmCard) => {
            this._renderFilmCardExtra(container, filmCard);
        });
        return dataArray;       
    }

    _renderMovieList() {

        if (this._isLoading) {
            this._renderLoading();
            return;
        }
        
        if (this._getMovies().length === 0) {
            if(this._EmptyFilmListComponent) {
                remove(this._EmptyFilmListComponent);
            }
            this._renderEmptyFilmList();
        } else {
           
            const moviesCount = this._getMovies().length;
            const movies = this._getMovies().slice(0, Math.min(moviesCount, this._renderedFilmsCounter));

            render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);

            this._renderMovieCards(this._filmListComponent.getElement()
                .querySelector(".films-list__container"), movies);

            // Теперь, когда _renderBoard рендерит доску не только на старте,
            // но и по ходу работы приложения, нужно заменить
            // константу MAX_FILM_COUNT на свойство ._renderedFilmsCounter,
            // чтобы в случае перерисовки сохранить N-показанных карточек
            if(moviesCount > this._renderedFilmsCounter) {
                this._renderShowMoreBtn();
            }

            this._renderSort();
            this._renderExtraSection();
        }
    }

    _renderShowMoreBtn() {
        if (this._showMoreBtnComponent !== null) {
            this._showMoreBtnComponent = null;
        }
        this._showMoreBtnComponent = new ShowMoreBtnView();
        this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtn);
        render(this._filmListComponent.getElement().querySelector(".films-list"), 
            this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    }

    _handleShowMoreBtn() {
        const moviesCount = this._getMovies().length;
        const newRenderedMovieCount = Math.min(moviesCount, this._renderedFilmsCounter + MAX_FILM_COUNT);
        const movies = this._getMovies().slice(this._renderedFilmsCounter, newRenderedMovieCount);

        this._renderMovieCards(this._filmListComponent.getElement().querySelector(".films-list__container"), movies);
        this._renderedFilmsCounter = newRenderedMovieCount;

        if(this._renderedFilmsCounter >= moviesCount) {
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
        const slicedFilms = this._getMovies().slice();
        
        const sortedByRateFilms = slicedFilms.sort((a, b) => b.total_rating - a.total_rating).slice(0, FILM_EXTRA_COUNT);
        const sortedByCommentsFilms = slicedFilms.sort((a, b) => b.comments.length - a.comments.length).slice(0, FILM_EXTRA_COUNT);

        this._renderExtraMovieCards(this._ratedComponent.getElement().querySelector(".films-list__container"), sortedByRateFilms);
        this._renderExtraMovieCards(this._commentsComponent.getElement().querySelector(".films-list__container"), sortedByCommentsFilms);
    }

    _clearMovieList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
        Object
            .values(this._moviePresenter)
            .forEach((presenter) => {presenter.destroy();});
        this._moviePresenter = {};
        remove(this._filmListComponent);
        remove(this._showMoreBtnComponent);
        remove(this._sortComponent);
        //this._renderedFilmsCounter = MAX_FILM_COUNT;
        if (resetRenderedFilmCount) {
            this._renderedFilmsCounter = MAX_FILM_COUNT;
        } else {
            // На случай, если перерисовка списка вызвана
            // уменьшением количества фильмов (например, удаление или перенос в архив)
            // нужно скорректировать число показанных фильмов
            this._renderedFilmsCounter = Math.min(this._getMovies().length, this._renderedFilmsCounter);
        }
        
        if (resetSortType) {
            this._currentSortType = SortType.DEFAULT;
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
