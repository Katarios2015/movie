import AbstractView from "./abstract.js";

const createEmptyFilmList = (filterType) => {
    if (filterType === "all") {
        return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
    </section>`;
    }
    else if (filterType === "whatchlist") {

        return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies to watch now</h2>
    </section>
    </section>`;

    }

    else if (filterType === "history") {
        return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no watched movies now</h2>
    </section>
    </section>`;
    }

    else if (filterType === "favorites") {
        return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no favorite movies now</h2>
    </section>
    </section>`;

    }
};

export default class EmptyFilmList extends AbstractView {
  constructor(filterType) {
    super();
    this._filterType = filterType;


}
    
    getTemplate() {
        return createEmptyFilmList(this._filterType);
    }

}