import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-characters',
  imports: [ReactiveFormsModule, FormsModule, PaginationModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
})
export class CharactersComponent {
  searchControl = new FormControl('', { nonNullable: true });
  pageControl = new FormControl(1, { nonNullable: true });

  totalItems = signal(0);

  // here's the task:
  // the page will initially call an api to load the character list
  // the data is paginated, so when the page is changed, you need to load the data of that page
  // when the user types anything in the search field, it also needs to search, the page needs to be resetted to 1
  // search requests should be debounced, and should cancel any previous pending request

  // the api url is:
  // https://rickandmortyapi.com/api/character
  // the search and page data needs to be send in the query params
  // it will be seomthing like this: { name: "searchedValue" or null, page: pageValue }
}
