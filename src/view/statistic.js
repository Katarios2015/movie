import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart.js";
import {siteFilterMap} from "../utils/filter.js";
import {FilterType} from "../utils/constants.js";
import {getTimeFormatHours, getTimeFormatMinutes, getUserRank, getUpperCase} from "../utils/common.js";



const renderGenresChart = (statisticCtx, movies) => {
    const BAR_HEIGHT = 50;
    const statisticCtxTest = document.querySelector(".statistic__chart");
    console.log(statisticCtxTest);
    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    //statisticCtx.height = BAR_HEIGHT * 5;
    // Функция для отрисовки диаграммы(количество просмотренных фильмов в разрезе жанров)
    const myChart = new Chart(statisticCtx, {
        plugins: [ChartDataLabels],
        type: "horizontalBar",
        data: {
            labels: ["Sci-Fi", "Animation", "Fantasy", "Comedy", "TV Series"],
            datasets: [{
                data: [11, 8, 7, 4, 3],
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
    return myChart;
    
}; 

const sortObject = (obj) => {
    Object.keys(obj).sort().forEach((key) => {
        var value = obj[key];
        delete obj[key];
        obj[key] = value;
        console.log( obj[key]);
    });
};

const duplicates = (arr) => arr.filter((number, index, numbers) => {
    //console.log(number); // number - элемент массива
    //console.log(index); // index - индекс элемента массива
    //console.log(numbers.indexOf(number)); // numbers - представление массива values
    console.log(numbers.indexOf(number) !== index);
    return numbers.indexOf(number) !== index;
});

const createStatsTemplate = (data) => {
    const allWhatchedFilms = siteFilterMap[FilterType.HISTORY](data).length;
    const whatchedArray = siteFilterMap[FilterType.HISTORY](data);

    const getTopGenre = () => {
        let watchedGenres = [];
        let topGenre = "";
        let swap = 0;
        
        whatchedArray.forEach((item) => {
            watchedGenres = watchedGenres.concat(item.genres).sort();
              
            let result = {};
            for (let i = 0; i < watchedGenres.length; i++)
            {
                const item = watchedGenres[i];
                if (result[item] != undefined){
                    result[item] +=1;
                }
                    
                else {
                    result[item] = 1;
                }
                   
            }

            for(const key in result) {
                if (result[key] > swap){
                    swap = result[key];
                    topGenre = key;
                    console.log(swap + " "+ topGenre); 
                }
                console.log( "genre " + key + " here "+ result[key] + " times"); 
                
            }
            //let count = {};
   
            /* const reduseTest = watchedGenres.forEach((item)=> {
                if (count[item]){
                    count[item] +=1;
                } else {
                    count[item] = 1;
                }

                console.log(count);
        });*/
        });
        return topGenre;
    };


    //Метод indexOf() возвращает первый индекс, по которому данный элемент может быть найден в массиве.
    //Соответственно, фильтруем значения, индекс которых не равен индексу, который вернул метод indexOf().
    
    console.log(getTopGenre());

    const getDurationTotal = () => {
        let total = 0;
        whatchedArray.map((item) =>  {
            total+=item.duration;
        });
        return total; 
    };

    const totalDurationHour = getTimeFormatHours(getDurationTotal());
    const totalDurationMinute = getTimeFormatMinutes(getDurationTotal());
   
    return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUpperCase(getUserRank(allWhatchedFilms))}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${allWhatchedFilms} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text"> ${totalDurationHour}<span class="statistic__item-description">h</span> 
        ${totalDurationMinute}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic_text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre()}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};



export default class Stats extends SmartView {
    constructor(movies) {
        super();
        this._data = movies;

        this._genresChart = null;

        this._setCharts();
    }

    getTemplate () {
        return createStatsTemplate(this._data);
    }

    restoreHandlers() {
        this._setCharts();
    }

    /*show () {
        this.getElement().querySelector(".statistic")
            .classList.remove("visually-hidden"); 

    }
    
    hide() {
        this.getElement().querySelector(".statistic")
            .classList.add("visually-hidden");
    }*/

    _setCharts() {
        // Нужно отрисовать диаграмму
        if (this._genresChart !== null) {
            this._genresChart = null;
        }
        const {movies} = this._data;
        const statisticCtx = this.getElement().querySelector(".statistic__chart");
        this._genresChart = renderGenresChart(statisticCtx, movies);
    }

}
