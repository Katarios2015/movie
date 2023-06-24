import AbstractView from "./abstract.js";
import {getUpperCase} from "../utils/common.js";

const createUserRankTemplate = (user) => {
    const {rank, avatar} = user;
    return `<section class="header__profile profile">
    <p class="profile__rating">${getUpperCase(rank)}</p>
    <img class="profile__avatar" src=${avatar} alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank extends AbstractView {
    constructor (users) {
        super();
        this._users = users;
    }

    getTemplate () {
        return createUserRankTemplate(this._users);
    }
}