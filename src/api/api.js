import MoviesModel from "../model/movies.js";
import CommentsModel from "../model/comments.js";

const Method = {
    GET: "GET",
    PUT: "PUT",
    POST: "POST",
    DELETE: "DELETE",
};
  
const SuccessHTTPStatusRange = {
    MIN: 200,
    MAX: 299,
};
  
export default class Api {
    constructor(endPoint, authorization) {
        this._endPoint = endPoint;
        this._authorization = authorization;
    }
  
    getMovies() {
        
        return this._load({url: "movies"})
            .then(Api.toJSON)
            .then((movies) => movies.map(MoviesModel.adaptToClient));
    }
    
    updateMovie(movies) {      
        return this._load({
            
            url: `movies/${movies.id}`,
            method: Method.PUT,
            body: JSON.stringify(MoviesModel.adaptToServer(movies)),
            headers: new Headers({"Content-Type": "application/json"}),
        })
            .then(Api.toJSON)
            .then(MoviesModel.adaptToClient);
    }

    getComments(movieId) {
        return this._load({url:`comments/${movieId}`})
            .then(Api.toJSON)
            .then((comments) => comments.map(CommentsModel.adaptToClient));
    }



    addComment(comment, movieId) {
        return this._load({
            url: `comments/${movieId}`,
            method: Method.POST,
            body: JSON.stringify(CommentsModel.adaptToServer(comment)),
            headers: new Headers({"Content-Type": "application/json"}),
        })
            .then(Api.toJSON)

            .then((response)=> { 
                return Object.assign(
                    {},
                    {
                        comments: response.comments.map(CommentsModel.adaptToClient)
                    }
                );
            });
    }

    deleteComment(comment) {
        return this._load({
            url: `comments/${comment.id}`,
            method: Method.DELETE,
        });
    }

    sync(data) {
        return this._load({
            url: "movies/sync",
            method: Method.POST,
            body: JSON.stringify(data),
            headers: new Headers({"Content-Type": "application/json"}),
        })
            .then(Api.toJSON);
    }
    

    _load({
        url,
        method = Method.GET,
        body = null,
        headers = new Headers(),
    }) {
        headers.append("Authorization", this._authorization);
        return fetch(
            `${this._endPoint}/${url}`,
            {method, body, headers},
        )
            .then(Api.checkStatus)
            .catch(Api.catchError);
    }
  
    static checkStatus(response) {
        if (
            response.status < SuccessHTTPStatusRange.MIN ||
        response.status > SuccessHTTPStatusRange.MAX
        ) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
  
        return response;
    }
  
    static toJSON(response) {
        return response.json();
    }
  
    static catchError(err) {
        throw err;
    }
}