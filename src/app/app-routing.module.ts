import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';  // Importar el guard

/*const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'monitor',
    loadChildren: () => import('./pages/monitor/monitor.module').then( m => m.MonitorPageModule)
  },
  {
    path: 'zonas',
    loadChildren: () => import('./pages/zonas/zonas.module').then( m => m.ZonasPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
];*/
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]  // Proteger la ruta con el AuthGuard
  },
  {
    path: 'monitor',
    loadChildren: () => import('./pages/monitor/monitor.module').then(m => m.MonitorPageModule),
    canActivate: [AuthGuard]  // Proteger la ruta del monitoreo con el guard
  },
  {
    path: 'zonas',
    loadChildren: () => import('./pages/zonas/zonas.module').then(m => m.ZonasPageModule),
    canActivate: [AuthGuard]  // Proteger la ruta de zonas con el guard
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',  // Si no hay ninguna ruta específica, redirigir a la página de inicio de sesión
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
