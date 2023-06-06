import FilmListView from "../view/film-list.js";
import EmptyFilmListView from "../view/empty-list.js";
import ShowMoreBtnView from "../view/show-more-btn.js";
import ExtraSectionView from "../view/create-extra-section.js";
import MenuView from "../view/menu.js";
import SortView from "../view/sort.js";

import {sortMovieDate, sortMovieRate, render, RenderPosition, remove} from "../utils/render.js";
import {updateItem,ExtraTitle, SortType} from "../utils/common.js";
//import  UserAction from "../utils/constants.js";
//import  UpdateType from "../utils/constants.js";

const UserAction = {
    UPDATE_MOVIE: "UPDATE_MOVIE",
    ADD_COMMENT: "ADD_COMMENT",
    DELETE_COMMENT: "DELETE_COMMENT",
};
  
const UpdateType = {
    PATCH: "PATCH",
    MINOR: "MINOR",
    MAJOR: "MAJOR",
};

import MoviePresenter from "./movie.js";

const MAX_FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;


export default class MovieList {
    constructor(siteContainer, siteBody, filter, moviesModel) {
        this._moviesModel = moviesModel;
       
        this._siteMainContainer = siteContainer;
        this._siteBodyContainer = siteBody;
        this._renderedFilmsCounter = MAX_FILM_COUNT;

        this._ratedComponent = null;
        this._commentsComponent = null;

        this._renderedFilter = filter;


        this._moviePresenter = {};
        this._moviePresenterExtra = {};

        this._currentSortType = SortType.DEFAULT;

        this._menuComponent = new MenuView(filter);
        this._filmListComponent = new FilmListView();

        this._sortComponent = null;
        this._showMoreBtnComponent = null;
        this._EmptyFilmListComponent = new EmptyFilmListView();
        
        this._handleShowMoreBtn = this._handleShowMoreBtn.bind(this);
        this._renderExtraSection = this._renderExtraSection.bind(this);
        this._handleModeChange = this._handleModeChange.bind(this);//режим просмотра или редактирования
        this._handleModeChangeExtra = this._handleModeChangeExtra.bind(this);
        //this._handleMovieChange = this._handleMovieChange.bind(this);
        //this._handleMovieExtraChange = this._handleMovieExtraChange.bind(this);
        this._handleSortTypeChange = this._handleSortTypeChange.bind(this);//сортировка

        this._handleViewAction = this._handleViewAction.bind(this);
        this._handleModelEvent = this._handleModelEvent.bind(this);

        

        this._moviesModel.addObserver(this._handleModelEvent);
       
    }

    init() {
        /*this._mockFilms = mockFilms.slice();
        // 1. В отличии от сортировки по любому параметру,
        // исходный порядок можно сохранить только одним способом -
        // сохранив исходный массив:
        this._sourcedMovies = mockFilms.slice();
        this._sourcedMoviesTwo = mockFilms.slice();*/
        render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);
        this._renderMovieList();
        
        this._renderMenu();
    }

    _handleViewAction(actionType, updateType, update) {
        switch (actionType) {
        case UserAction.UPDATE_MOVIE:
            this._moviesModel.updateMovie(updateType, update);
            break;
        case UserAction.ADD_COMMENT:
            this._commentsModel.addComment(updateType, update);
            break;
        case UserAction.DELETE_COMMENT:
            this._commentsModel.deleteComment(updateType, update);
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
            //this._moviePresenterExtra[data.id].init(filmContainer, data); добвавить условие
            break;
        case UpdateType.MINOR:
            this._clearMovieList();
            this._renderMovieList(); // - обновить список (без сброса сортировки и фильтров)*/
           
            break;
        case UpdateType.MAJOR:
            // - обновить весь список (например, при переключении фильтра),сбрасываем сортировку и фильтры
            this._clearMovieList({resetRenderedFilmCount: true, resetSortType: true});
            this._renderMovieList();
            break;
        }
    }


    _getMovies() {
        //const slicedMovies = this._moviesModel.getMovies().slice();
        switch (this._currentSortType) {
        case SortType.DATE:
            return this._moviesModel.getMovies().slice().sort(sortMovieDate);
        case SortType.RATE:
            return this._moviesModel.getMovies().slice().sort(sortMovieRate);
        }
        return this._moviesModel.getMovies();
        
    }

    _renderSort() {
        if (this._sortComponent !== null) {
            this._sortComponent = null;
        }
      
        this._sortComponent = new SortView(this._currentSortType);
        this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
        render(this._filmListComponent, this._sortComponent, RenderPosition.BEFORE);
        
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
        const moviePresenter = new MoviePresenter(this._siteBodyContainer, this._handleViewAction,  this._handleModeChange, this._commentsModel);
        moviePresenter.init(filmContainer, filmData);
        this._moviePresenter[filmData.id] = moviePresenter;
    }

    _renderFilmCardExtra(filmContainer, filmData) {
        
        const moviePresenterExtra = new MoviePresenter(this._siteBodyContainer, this._handleViewAction,  this._handleModeChangeExtra);
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
        
        if (this._getMovies().length === 0) {
            this._renderEmptyFilmList();
        } else {
            
            const moviesCount = this._getMovies().length;
            const movies = this._getMovies().slice(0, Math.min(moviesCount, this._renderedFilmsCounter));

            render(this._siteMainContainer, this._filmListComponent, RenderPosition.BEFOREEND);

            this._renderMovieCards(this._filmListComponent.getElement().querySelector(".films-list__container"), movies);

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
        render(this._filmListComponent.getElement().querySelector(".films-list"), this._showMoreBtnComponent, RenderPosition.BEFOREEND);
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
        
        const sortedByRateFilms = slicedFilms.sort((a, b) => b.rate - a.rate).slice(0, FILM_EXTRA_COUNT);
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
            // На случай, если перерисовка доски вызвана
            // уменьшением количества задач (например, удаление или перенос в архив)
            // нужно скорректировать число показанных задач
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
