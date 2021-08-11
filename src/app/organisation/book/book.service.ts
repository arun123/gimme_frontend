import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Book } from './book.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    private bookUrl: string = environment.url+'/api/books';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    getBook(id: string): Observable<Book> {
        const url = `${this.bookUrl}/${id}`;
        return this.http.get<Book>(url, this.httpOptions);
    }

    getBooks(): Observable<Book[]> {
        let headers = new HttpHeaders({
            'accept':  'application/json',
            'Content-Type' : 'application/json',
          });
        let params = new HttpParams().set('isDeleted', 'false');
        return this.http.get<Book[]>(this.bookUrl, { headers, params: params } );
    }

    addBook(book: Book): Observable<Book> {
        return this.http.post<Book>(this.bookUrl, JSON.stringify(book), this.httpOptions).pipe(
            tap((book:Book) => console.log()),
            catchError(error => of(new Book()))
        );
    }

    updateBook(book: Book): Observable<Book> {
        return this.http.put<Book>(this.bookUrl + `/${book.id}`, JSON.stringify(book), this.httpOptions).pipe(
            tap((book:Book) => console.log())
        );
    }

    deleteBook(book: Book): Observable<Book> {
        return this.http.delete<Book>(this.bookUrl + `/${book.id}`, this.httpOptions).pipe(
            tap((Book:Book) => console.log())
        );
    }
}
