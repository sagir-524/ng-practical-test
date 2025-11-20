import { httpResource } from '@angular/common/http';
import { Component, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginatedResponse } from '../../types/paginated-response.interface';
import { Character } from '../../types/character.interface';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map, startWith } from 'rxjs';

// even more elgant solution with new signal apis
@Component({
  selector: 'app-characters-solution-signal',
  imports: [FormsModule, PaginationModule],
  templateUrl: './characters-solution-signal.component.html',
  styleUrl: './characters-solution-signal.component.scss',
})
export class CharactersSolutionSignalComponent {
  search = signal('');

  #debouncedSearch = toSignal(
    toObservable(this.search).pipe(
      debounceTime(300),
      startWith(this.search()),
      map((value) => value?.trim() || '')
    )
  );

  page = linkedSignal({
    source: this.#debouncedSearch,
    computation: () => 1,
  });

  data = httpResource<PaginatedResponse<Character>>(() => ({
    method: 'GET',
    url: 'https://rickandmortyapi.com/api/character',
    params: {
      name: this.#debouncedSearch() || '',
      page: this.page(),
    },
  }));
}
