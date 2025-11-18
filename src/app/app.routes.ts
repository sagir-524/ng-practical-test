import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full',
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./pages/characters/characters.component').then(
        (c) => c.CharactersComponent
      ),
  },
  {
    path: 'boxes',
    loadComponent: () =>
      import('./pages/boxes/boxes.component').then((c) => c.BoxesComponent),
  },
];
