import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../layout';
import { HomePage } from '../home';
import { AboutPage } from '../about';
import { BlackFridayPage } from '../blackfriday';
import { CategoryPage, ProductPage } from '../products';
import { CommunityPage } from '../community';
import { FavoritesPage } from '../favorites';
import { LoginPage, ProtectedRoute, AuthCallback } from '../auth';
import { SearchPage } from '../search';
import { LegalPage } from '../legal';
import { DogsPage, DogDashboard } from '../dogs';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'black-friday', element: <BlackFridayPage /> },
      { path: 'category/:categoryId', element: <CategoryPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'product/:productId', element: <ProductPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'legal/:page', element: <LegalPage /> },
      { 
        path: 'dogs',
        element: <ProtectedRoute><DogsPage /></ProtectedRoute>
      },
      {
        path: 'dog/:dogId',
        element: <ProtectedRoute><DogDashboard /></ProtectedRoute>
      },
      { path: 'auth/callback', element: <AuthCallback /> }
    ]
  }
];