import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './features/layout';
import { HomePage } from './features/home';
import { AboutPage } from './features/about';
import { BlackFridayPage } from './features/blackfriday';
import { CategoryPage, ProductPage } from './features/products';
import { CommunityPage } from './features/community';
import { FavoritesPage } from './features/favorites';
import { LoginPage } from './features/auth';
import { SearchPage } from './features/search';
import { LegalPage } from './features/legal';
import { DogsPage, DogDashboard } from './features/dogs';
import { BreedPage, ArticlePage, VideoLibraryPage, BlogsPage } from './features/breeds';
import { BreedGuidePage } from './features/breed-guide';
import { SizeCalculatorPage } from './features/size-calculator';
import { HealthTrackerPage } from './features/health-tracker';
import { EventsPage } from './features/events';
import { RemindersPage } from './features/reminders';
import { AuthCallback } from './features/auth';
import { BundleBuilderPage, BundleManagerPage } from './features/bundle-builder/pages';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="black-friday" element={<BlackFridayPage />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="product/:productId" element={<ProductPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="breed/:breed" element={<BreedPage />} />
        <Route path="article/:articleId" element={<ArticlePage />} />
        <Route path="breed/:breed/videos" element={<VideoLibraryPage />} />
        <Route path="blogs/:breed" element={<BlogsPage />} />
        <Route path="breed-guide" element={<BreedGuidePage />} />
        <Route path="size-calculator" element={<SizeCalculatorPage />} />
        <Route path="health-tracker" element={<HealthTrackerPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="legal/:page" element={<LegalPage />} />

        {/* Bundle Builder Routes */}
        <Route path="bundle-builder" element={<BundleBuilderPage />} />
        <Route path="bundle-builder/:bundleId" element={<BundleBuilderPage />} />
        <Route path="bundles" element={<BundleManagerPage />} />

        {/* Dog Management */}
        <Route path="dogs" element={<DogsPage />} />
        <Route path="dog/:dogId" element={<DogDashboard />} />

        {/* Auth Routes */}
        <Route path="auth/callback" element={<AuthCallback />} />
      </Route>
    </Routes>
  );
};

export default App;