import AbstractView from "./abstract.js";

const createLoadingListTemplate = () => {
    return `<h2 class="films-list__title">Loading...</h2>
    `;
};

export default class Load extends AbstractView {
    
    getTemplate() {
        return createLoadingListTemplate();
    }

}