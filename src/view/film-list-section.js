import {createElement} from "../render.js";

const createFilmListSectionTemplate = () => {
    return `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

    <div class="films-list__container">
  </section>`;
};

export default class FilmList {
    constructor () {
        this.element = null;
    }

    getTemplate() {
        return createFilmListSectionTemplate();
    }

    getElement() {
        if(!this.element) {
            this.element = createElement(this.getTemplate());
        }
        return this.element; 
    }

    removeElement () {
        this.element = null;
    }

}

