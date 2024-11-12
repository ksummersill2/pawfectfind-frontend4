import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../features/layout';
import { HomePage } from '../features/home';
import { AboutPage } from '../features/about';
import { BlackFridayPage } from '../features/blackfriday';
import { CategoryPage, ProductPage } from '../features/products';
import { CommunityPage } from '../features/community';
import { FavoritesPage } from '../features/favorites';
import { LoginPage } from '../features/auth';
import { SearchPage } from '../features/search';
import { LegalPage } from '../features/legal';
import { DogsPage, DogDashboard } from '../features/dogs';
import { BreedPage, ArticlePage, VideoLibraryPage, BlogsPage } from '../features/breeds';
import { BreedGuidePage } from '../features/breed-guide';
import { ProtectedRoute, AuthCallback } from '../features/auth';

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
      { path: 'breed/:breed', element: <BreedPage /> },
      { path: 'article/:articleId', element: <ArticlePage /> },
      { path: 'breed/:breed/videos', element: <VideoLibraryPage /> },
      { path: 'blogs/:breed', element: <BlogsPage /> },
      { path: 'breed-guide', element: <BreedGuidePage /> },
      { 
        path: 'dogs',
        element: <DogsPage />
      },
      {
        path: 'dog/:dogId',
        element: <DogDashboard />
      },
      { path: 'auth/callback', element: <AuthCallback /> }
    ]
  }
];