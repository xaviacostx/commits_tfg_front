import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'log-in',
    pathMatch: 'full',
  },
  
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage),
    //El canActivate hace que solo puedas acceder si estas logueado
    canActivate: [AuthGuard]
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.page').then( m => m.ProductosPage),
    //El canActivate hace que solo puedas acceder si estas logueado
    canActivate: [AuthGuard]

  },
  {
    path: 'log-in',
    loadComponent: () => import('./log-in/log-in.page').then( m => m.LogInPage)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./ranking/ranking.page').then( m => m.RankingPage)
  },
];
