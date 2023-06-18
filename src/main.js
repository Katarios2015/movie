import {renderTemplate, render, RenderPosition} from "./utils/render.js";

//import {generateFilter} from "./mock/filter.js";
//import {siteFilterMap} from "./utils/filter.js";
import UserRank from "./view/user-rank.js";

import {generateFilm, popupComments} from "./mock/film.js";

import {generateUseRank} from "./mock/rank.js";

import MovieListPresenter from "./presenter/movie-list.js";
import MenuFilterPresenter from "./presenter/filter.js";

import MoviesModel from "./model/movies.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";

const MOCK_FILMS_COUNT = 20;


const siteBody = document.querySelector("body");
const siteMainContainer = document.querySelector(".main");

const siteHeader = document.querySelector(".header");
const siteFooter = document.querySelector(".footer");

const footerStat = siteFooter.querySelector(".footer__statistics");

const comments = popupComments;
const mockFilms = new Array(MOCK_FILMS_COUNT).fill().map(() => generateFilm(comments));


const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const moviesModel = new MoviesModel();
moviesModel.setMovies(mockFilms);

const filterModel = new FilterModel();

//FilterModel.setFilters(mockFilms);

//render(siteMainContainer, new Menu(filmFilters), RenderPosition.AFTERBEGIN);

render(siteHeader, new UserRank(generateUseRank()), RenderPosition.BEFOREEND);

renderTemplate (footerStat, `<p>${MOCK_FILMS_COUNT} movies inside</p>`, RenderPosition.BEFOREEND);

const filterPresenter = new MenuFilterPresenter (siteMainContainer, filterModel, moviesModel);
const movieListPresenter = new MovieListPresenter(siteMainContainer, siteBody, moviesModel, commentsModel, filterModel);
filterPresenter.init();
movieListPresenter.init();
