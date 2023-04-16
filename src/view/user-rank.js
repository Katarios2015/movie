export const createUserRankTemplate = (user) => {
    const {rank, avatar} = user;
    return `<section class="header__profile profile">
    <p class="profile__rating">${rank[0].toUpperCase() + rank.slice(1)}</p>
    <img class="profile__avatar" src=${avatar} alt="Avatar" width="35" height="35">
  </section>`;
};