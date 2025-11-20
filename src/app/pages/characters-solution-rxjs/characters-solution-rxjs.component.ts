import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { PaginatedResponse } from '../../types/paginated-response.interface';
import { Character } from '../../types/character.interface';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-characters',
  imports: [ReactiveFormsModule, FormsModule, PaginationModule, AsyncPipe],
  templateUrl: './characters-solution-rxjs.component.html',
  styleUrl: './characters-solution-rxjs.component.scss',
})
export class CharactersSolutionRxjsComponent {
  #http = inject(HttpClient);

  searchControl = new FormControl('', { nonNullable: true });
  pageControl = new FormControl(1, { nonNullable: true });

  totalItems = signal(0);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // # at the start of any property name means private
  #search$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    startWith(this.searchControl.value), // startwith after debounce makes sure to emit value initially and not wait for the first time
    map((value) => value?.trim() || ''), // making sure the value is string && always trimmed from start/end white spaces
    distinctUntilChanged(), // makes sure the the value is not emitted if the value is same as the previous one,
    tap(() => this.pageControl.setValue(1)) // side effect, setting page to 1 when search value changes
  );

  #page$ = this.pageControl.valueChanges.pipe(
    startWith(this.pageControl.value),
    distinctUntilChanged()
  );

  characters$ = combineLatest([this.#search$, this.#page$]).pipe(
    tap(() => { // side effects
      this.loading.set(true); // setting loading state to true before making any request
      this.errorMessage.set(null); // setting error message to null before making any request
    }),
    switchMap(([search, page]) => { // using switchmap will makes sure nay previous pending request is canceled
      return this.#http
        .get<PaginatedResponse<Character>>(
          'https://rickandmortyapi.com/api/character',
          {
            params: { name: search, page }, // sending the search and page query params
          }
        )
        .pipe(
          tap(({ info }) => { // side effects
            this.totalItems.set(info.count); // resetting the total info to re-render pagination
            this.loading.set(false); // data is resolved, so loading needs to switched off
          }),
          map(({ results }) => results), // only sending the resutls array
          catchError((error: HttpErrorResponse) => { // handling any error
            this.loading.set(false);
            if (error.status !== 404) { // the api responds with 404 when the results array is empty, so making sure it's handled properly
              this.errorMessage.set(
                'Sorry, something went wrong. Please try again later.'
              );
            }

            return of([] as Character[]); // returning empty array for any error
          })
        );
    })
  );
}
