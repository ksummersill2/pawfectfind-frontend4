import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../layout';
import { HomePage } from '../home';
import { AboutPage } from '../about';
import { BlackFridayPage } from '../blackfriday';
import { CategoryPage, ProductPage } from '../products';
import { CommunityPage } from '../community';
import { FavoritesPage } from '../favorites';
import { LoginPage } from '../auth';
import { SearchPage } from '../search';
import { LegalPage } from '../legal';
import { DogsPage, DogDashboard } from '../dogs';
import { BreedPage, ArticlePage, VideoLibraryPage, BlogsPage } from '../breeds';
import { BreedGuidePage } from '../breed-guide';
import { BundleBuilderPage } from '../bundle-builder/pages';
import { ProtectedRoute, AuthCallback } from '../auth';

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
      { path: 'bundle-builder', element: <BundleBuilderPage /> },
      { path: 'bundle-builder/:bundleId', element: <BundleBuilderPage /> },
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