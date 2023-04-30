import AbstractView from "./abstract.js";

const createFilmListSectionTemplate = () => {
    return `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

    <div class="films-list__container">
    </div>
  </section>`;
};

export default class FilmList extends  AbstractView {
   /* constructor(){
        super();

    }*/

    getTemplate() {
        return createFilmListSectionTemplate();
    }

    /*_extraSetClickHandler(evt) {
        evt.preventDefault();
        this._callback.clickExtraFilmCard();
    }

    set*/

}

