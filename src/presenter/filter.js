import MenuFilterView from "../view/filters-menu.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {siteFilterMap} from "../utils/filter.js";
import {FilterType, UpdateType} from "../utils/constants.js";



export default class Filter {
    constructor(mainNavContainer, filterModel, moviesModel) {
        this._mainNavContainer = mainNavContainer;
        this._filterModel = filterModel;
        this._moviesModel = moviesModel;

        this._menuFilterComponent = null;

        this._handleModelEvent = this._handleModelEvent.bind(this);
        this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

        this._moviesModel.addObserver(this._handleModelEvent);
        this._filterModel.addObserver(this._handleModelEvent);
    }

    init() {
        const filters = this._getFilters();
        const prevMenuFilterComponent = this._menuFilterComponent;

        this._menuFilterComponent = new MenuFilterView(filters, this._filterModel.getFilter());
        this._menuFilterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

        if (prevMenuFilterComponent === null) {
            render(this._mainNavContainer, this._menuFilterComponent, RenderPosition.BEFORE);
            return;
        }

        replace(this._menuFilterComponent, prevMenuFilterComponent);
        remove(prevMenuFilterComponent);
    }

    _handleModelEvent() {
        this.init();
    }

    _handleFilterTypeChange(filterType) {
        if (this._filterModel.getFilter() === filterType) {
            return;
        }

        this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    }

    _getFilters() {
        const movies = this._moviesModel.getMovies();

        return [
            {
                type: FilterType.ALL,
                name: "All movies",
                count: siteFilterMap[FilterType.ALL](movies).length,
            },
            {
                type: FilterType.WATCHLIST,
                name: "WatchList",
                count: siteFilterMap[FilterType.WATCHLIST](movies).length,
            },
            {
                type: FilterType.HISTORY,
                name: "History",
                count: siteFilterMap[FilterType.HISTORY](movies).length,
            },
            {
                type: FilterType.FAVORITES,
                name: "Favorites",
                count: siteFilterMap[FilterType.FAVORITES](movies).length,
            },
  
        ];
    }
}