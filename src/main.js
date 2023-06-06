import {renderTemplate, render, RenderPosition} from "./utils/render.js";

import {generateFilter} from "./mock/filter.js";

import UserRank from "./view/user-rank.js";

import {generateFilm} from "./mock/film.js";

import {generateUseRank} from "./mock/rank.js";

import MovieListPresenter from "./presenter/movie-list.js";

import MoviesModel from "./model/movies.js";
import CommentsModel from "./model/comments.js";


const MOCK_FILMS_COUNT = 20;


const siteBody = document.querySelector("body");
const siteMainContainer = document.querySelector(".main");

const siteHeader = document.querySelector(".header");
const siteFooter = document.querySelector(".footer");

const footerStat = siteFooter.querySelector(".footer__statistics");

const mockFilms = new Array(MOCK_FILMS_COUNT).fill().map(generateFilm);
const filmFilters = generateFilter(mockFilms);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

moviesModel.setMovies(mockFilms);
commentsModel.setComments(mockFilms);

console.log(mockFilms);


//render(siteMainContainer, new Menu(filmFilters), RenderPosition.AFTERBEGIN);

render(siteHeader, new UserRank(generateUseRank()), RenderPosition.BEFOREEND);

renderTemplate (footerStat, `<p>${MOCK_FILMS_COUNT} movies inside</p>`, RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(siteMainContainer, siteBody, filmFilters, moviesModel);
movieListPresenter.init();

