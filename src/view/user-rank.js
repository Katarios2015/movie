import {createElement} from "../render.js";

const createUserRankTemplate = (user) => {
    const {rank, avatar} = user;
    return `<section class="header__profile profile">
    <p class="profile__rating">${rank[0].toUpperCase() + rank.slice(1)}</p>
    <img class="profile__avatar" src=${avatar} alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank {
    constructor (users) {
        this._users = users;
        this._element = null;
    }

    getTemplate () {
        return createUserRankTemplate(this._users);
    }

    getElement () {
        if(!this._element) {
            this._element = createElement(this.getTemplate());
        }
      
        return this._element;
    }
  
    removeElement () {
        this._element = null;
    }
}