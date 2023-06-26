import dayjs from "dayjs";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart.js";
//import {siteFilterMap} from "../utils/filter.js";
import {InputType} from "../utils/constants.js";
import {getSortedGenreObject, getDurationTotal, getTopGenre, getWatchedArray, siteInputMap} from "../utils/statistic.js";
import {getTimeFormatHours, getTimeFormatMinutes, getUserRank, getUpperCase} from "../utils/common.js";

/*<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>*/

const createInputTemplate = (input, currentInput)=> {
    const {type, name} = input;
    const checkedInput = type === currentInput ? "checked" :"";
    return (
        `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${checkedInput}>
        <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
    );
};

const createStatsMenuTemplate = (inputs, currentInput) => {
    const inputTemplate = inputs
        .map((input) => createInputTemplate(input,currentInput)).join("");
    return ` <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${inputTemplate}</form>`;
};



const renderGenresChart = (statisticCtx, data) => {
    const BAR_HEIGHT = 50; //вынести в файл констант
    const whatchedArray = getWatchedArray(data);
    
    if (whatchedArray === []) {
        return "";
    }

    const genreObject = getSortedGenreObject(whatchedArray);
    console.log(genreObject);
    const arrayOfObgectGenres = Object.entries(genreObject).sort((a,b)=>b[1]-a[1]);
    console.log(arrayOfObgectGenres);
    let generKeys = [];
    let genres = [];

    arrayOfObgectGenres.forEach(([name,count]) => {
        genres = [...genres, name];
        generKeys = [...generKeys, count];
    });
 
    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    statisticCtx.height = BAR_HEIGHT * arrayOfObgectGenres.length;
    // Функция для отрисовки диаграммы(количество просмотренных фильмов в разрезе жанров)
    return new Chart(statisticCtx, {
        plugins: [ChartDataLabels],
        type: "horizontalBar",
        data: {
            labels: genres,
            datasets: [{
                data: generKeys,
                backgroundColor: "#ffe800",
                hoverBackgroundColor: "#ffe800",
                anchor: "start",
            }],
        },
        options: {
            plugins: {
                datalabels: {
                    font: {
                        size: 20,
                    },
                    color: "#ffffff",
                    anchor: "start",
                    align: "start",
                    offset: 40,
                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "#ffffff",
                        padding: 100,
                        fontSize: 20,
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    barThickness: 24,
                }],
                xAxes: [{
                    ticks: {
                        display: false,
                        beginAtZero: true,
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                }],
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false,
            },
        },
    });
     
    
}; 


const createStatsTemplate = (data, inputs, currentInput, whatchedArray) => {
   // const whatchedArray = getWatchedArray(data);
    //const allWhatchedFilmLength = whatchedArray.length;
   
    const genreObject = getSortedGenreObject(data);
    
    const TopGenre = getTopGenre(genreObject);
    const totalDurationHour = getTimeFormatHours(getDurationTotal(data));
    const totalDurationMinute = getTimeFormatMinutes(getDurationTotal(data));
   
    return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUpperCase(getUserRank(whatchedArray.length))}</span>
    </p>
    ${createStatsMenuTemplate(inputs, currentInput)}

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${data.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDurationHour}<span class="statistic__item-description">h</span> 
        ${totalDurationMinute}
        <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic_text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${TopGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};


    //this.#data = filmsToFilterMap[this.#currentFilter](this.#watchedFilms);

export default class Stats extends SmartView {
    constructor(movies) {
        super();
        this._movies = movies;        
        this._genresChart = null;
        this._inputs = this._getInputs();
        this._currentInput =  InputType.ALL_TIME;
        
        this._whatchedArray = getWatchedArray(this._movies);
        this._whatchedArray.forEach((item) => console.log(item.watchingDate));
        
        this._data = siteInputMap[this._currentInput](this._movies);
        //this._setCharts();
        this._inputTypeChangeHandler = this._inputTypeChangeHandler.bind(this);
        this.setInputTypeChangeHandler(this._inputTypeChangeHandler);
        
    }

    getTemplate () {
        
        return createStatsTemplate(this._data, this._inputs, this._currentInput, this._whatchedArray);
    }

    restoreHandlers() {
        this.setCharts();
        this.setInputTypeChangeHandler();
    }


    setCharts() {
        // Нужно отрисовать диаграмму
        if (this._genresChart !== null) {
            this._genresChart = null;
        }
        const statisticCtx = document.querySelector(".statistic__chart");
        //console.log(statisticCtx);
        this._genresChart = renderGenresChart(statisticCtx, this._data);
    }

    _inputTypeChangeHandler(evt) {
        /*if (evt.target.tagName !== "A") {
            return;
        }*/
        evt.preventDefault();
        this._currentInput = evt.target.value;
        
        this._data = siteInputMap[this._currentInput](this._whatchedArray);
       
        this.updateElement();
        //this._callback.inputTypeChange();
    }
    
    setInputTypeChangeHandler(callback) {
        this._callback.inputTypeChange = callback;
        this.getElement().addEventListener("change", this._inputTypeChangeHandler);
        
    }

    _getInputs() {

        return [
            {
                type: InputType.ALL_TIME,
                name: "All time",
                //count: siteInputMap[InputType.ALL_TIME](movies).length,
            },
            {
                type: InputType.TODAY,
                name: "Today",
                //count: siteInputMap[InputType.TODAY](movies).length,
            },
            {
                type: InputType.WEEK,
                name: "Week",
                //count: siteInputMap[InputType.WEEK](movies).length,
            },
            {
                type: InputType.MONTH,
                name: "Month",
                //count: siteInputMap[InputType.MONTH](movies).length,
            },
            {
                type: InputType.YEAR,
                name: "Year",
                //count: siteInputMap[InputType.YEAR](movies).length,
            },
  
        ];
    }

}

