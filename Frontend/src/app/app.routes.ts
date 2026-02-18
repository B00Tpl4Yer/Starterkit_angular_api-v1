import { Routes } from '@angular/router';

export const routes: Routes = [
  // Public Routes (dengan PublicLayout)
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/public/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/public/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./pages/public/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/public/home/home.component').then(m => m.HomeComponent) // TODO: Create about component
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/public/home/home.component').then(m => m.HomeComponent) // TODO: Create contact component
      }
    ]
  },
  
  // Auth Routes (dengan AuthLayout)
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  
  // User Routes (dengan UserLayout - requires authentication)
  {
    path: 'user',
    loadComponent: () => import('./layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    // canActivate: [AuthGuard], // TODO: Add authentication guard
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/user/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/user/dashboard/dashboard.component').then(m => m.DashboardComponent) // TODO: Create user products component
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/user/dashboard/dashboard.component').then(m => m.DashboardComponent) // TODO: Create orders component
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/user/dashboard/dashboard.component').then(m => m.DashboardComponent) // TODO: Create customers component
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/user/dashboard/dashboard.component').then(m => m.DashboardComponent) // TODO: Create reports component
      },
      {
        path: 'profile/edit',
        loadComponent: () => import('./pages/user/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/user/dashboard/dashboard.component').then(m => m.DashboardComponent) // TODO: Create settings component
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  // Wildcard Route - 404 Not Found
  {
    path: '**',
    redirectTo: ''
  }
];
