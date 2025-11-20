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
    path: 'characters-rxjs',
    loadComponent: () =>
      import(
        './pages/characters-solution-rxjs/characters-solution-rxjs.component'
      ).then((c) => c.CharactersSolutionRxjsComponent),
  },
  {
    path: 'characters-signal',
    loadComponent: () =>
      import(
        './pages/characters-solution-signal/characters-solution-signal.component'
      ).then((c) => c.CharactersSolutionSignalComponent),
  },
  {
    path: 'boxes',
    loadComponent: () =>
      import('./pages/boxes/boxes.component').then((c) => c.BoxesComponent),
  },
  {
    path: 'boxes-solution',
    loadComponent: () =>
      import('./pages/boxes-solution/boxes-solution.component').then(
        (c) => c.BoxesSolutionComponent
      ),
  },
];
