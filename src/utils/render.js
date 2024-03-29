import Abstract from "../view/abstract.js";
import {dayjs} from "../utils/common.js";

export const RenderPosition = {
    AFTERBEGIN: "afterbegin",
    BEFOREEND: "beforeend",
};

export const render = (container, child, place) => {
//проверяем принадлежит ли классу
    if (container instanceof Abstract) {
        container = container.getElement();
    }

    if (child instanceof Abstract) {
        child = child.getElement();
    }

    switch (place) {
    case RenderPosition.AFTERBEGIN:
        container.prepend(child);
        break;
    case RenderPosition.BEFOREEND:
        container.append(child);
        break;
    case RenderPosition.BEFORE:
        container.before(child);
        break;
    }
};

export const renderTemplate = (container, template, place) => {
    container.insertAdjacentHTML(place, template);
};

// Принцип работы прост:
// 1. создаём пустой div-блок
// 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
// 3. возвращаем этот DOM-элемент
export const createElement = (template) => {
    const newElement = document.createElement("div"); // 1
    newElement.innerHTML = template; // 2
    return newElement.firstChild;
    // 3
};
// Единственный нюанс, что HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

export const remove = (component) => {
    if (component === null) {
        return;
    }
    if (!(component instanceof Abstract)) {
        throw new Error("Can remove only components");
    }

    component.getElement().remove();
    component.removeElement();
};

export const replace = (newChild, oldChild) => {
    if (oldChild instanceof Abstract) {
        oldChild = oldChild.getElement();
    }

    if (newChild instanceof Abstract) {
        newChild = newChild.getElement();
    }

    const parent = oldChild.parentElement;

    if (parent === null || oldChild === null || newChild === null) {
        throw new Error("Can't replace unexisting elements");
    }

    parent.replaceChild(newChild, oldChild);
};

export const sortMovieDate = (a,b) => {
    return (dayjs(b.filmInfo.release.date).format("YYYY") - dayjs(a.filmInfo.release.date).format("YYYY"));//ДОДЕЛАТЬ year
};



export const sortMovieRate = (a,b) => {
    return (b.filmInfo.totalRating - a.filmInfo.totalRating);
};