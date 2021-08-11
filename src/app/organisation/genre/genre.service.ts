import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Genre } from './genre.model';

@Injectable({
    providedIn: 'root'
})
export class GenreService {

    private genresUrl: string = environment.url+'/api/genres';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    getGenre(id: string): Observable<Genre> {
        const url = `${this.genresUrl}/${id}`;
        return this.http.get<Genre>(url, this.httpOptions);
    }

    getGenres(): Observable<Genre[]> {
        let headers = new HttpHeaders({
            'accept':  'application/json',
            'Content-Type' : 'application/json',
          });
        let params = new HttpParams().set('isDeleted', 'false');
        return this.http.get<Genre[]>(this.genresUrl, { headers, params: params } );
    }

    addGenre(genre: Genre): Observable<Genre> {
        return this.http.post<Genre>(this.genresUrl, JSON.stringify(genre), this.httpOptions).pipe(
            tap((genre:Genre) => console.log()),
            catchError(error => of(new Genre()))
        );
    }

    updateGenre(genre: Genre): Observable<Genre> {
        return this.http.put<Genre>(this.genresUrl + `/${genre.id}`, JSON.stringify(genre), this.httpOptions).pipe(
            tap((genre:Genre) => console.log())
        );
    }

    deleteGenre(genre: Genre): Observable<Genre> {
        return this.http.delete<Genre>(this.genresUrl + `/${genre.id}`, this.httpOptions).pipe(
            tap((genre:Genre) => console.log())
        );
    }
}
