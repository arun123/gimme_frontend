import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Author } from './author.model';

@Injectable({
    providedIn: 'root'
})
export class AuthorService {

    private authorsUrl: string = environment.url+'/api/authors';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    getAuthor(id: string): Observable<Author> {
        const url = `${this.authorsUrl}/${id}`;
        return this.http.get<Author>(url, this.httpOptions);
    }

    getAuthors(): Observable<Author[]> {
        let headers = new HttpHeaders({
            'accept':  'application/json',
            'Content-Type' : 'application/json',
          });
        let params = new HttpParams().set('isDeleted', 'false');
        return this.http.get<Author[]>(this.authorsUrl, { headers, params: params } );
    }

    addAuthor(author: Author): Observable<Author> {
        return this.http.post<Author>(this.authorsUrl, JSON.stringify(author), this.httpOptions).pipe(
            tap((Author:Author) => console.log()),
            catchError(error => of(new Author()))
        );
    }

    updateAuthor(author: Author): Observable<Author> {
        return this.http.put<Author>(this.authorsUrl + `/${author.id}`, JSON.stringify(author), this.httpOptions).pipe(
            tap((Author:Author) => console.log())
        );
    }

    deleteAuthor(author: Author): Observable<Author> {
        return this.http.delete<Author>(this.authorsUrl + `/${author.id}`, this.httpOptions).pipe(
            tap((Author:Author) => console.log())
        );
    }
}
