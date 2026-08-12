import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import AdminRoute from './components/guards/AdminRoute';
import GuestRoute from './components/guards/GuestRoute';
import PageLoader from './components/common/PageLoader';

// ---- Public Pages (lazy) ----
const HomePage = lazy(() => import('./pages/HomePage'));
const BrowsePetsPage = lazy(() => import('./pages/BrowsePetsPage'));
const PetDetailPage = lazy(() => import('./pages/PetDetailPage'));
const LostFoundPage = lazy(() => import('./pages/LostFoundPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

// ---- Protected Pages (lazy) ----
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyListingsPage = lazy(() => import('./pages/MyListingsPage'));
const SavedPetsPage = lazy(() => import('./pages/SavedPetsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const MyReportsPage = lazy(() => import('./pages/MyReportsPage'));
const CreateListingPage = lazy(() => import('./pages/CreateListingPage'));
const EditPetPage = lazy(() => import('./pages/EditPetPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));

// ---- Admin Pages (lazy, separate chunk) ----
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminPetsPage = lazy(() => import('./pages/admin/AdminPetsPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));

// ---- 404 ----
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// ---- Suspense Wrapper ----
const SuspenseWrapper = ({ children }) => (
    <Suspense fallback={<PageLoader />}>
        {children}
    </Suspense>
);

// ---- Route Definitions ----
const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            // Public routes
            {
                index: true,
                element: (
                    <SuspenseWrapper>
                        <HomePage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'pets',
                element: (
                    <SuspenseWrapper>
                        <BrowsePetsPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'pets/:id',
                element: (
                    <SuspenseWrapper>
                        <PetDetailPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'lost-found',
                element: (
                    <SuspenseWrapper>
                        <LostFoundPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'about',
                element: (
                    <SuspenseWrapper>
                        <AboutPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'contact',
                element: (
                    <SuspenseWrapper>
                        <ContactPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'privacy',
                element: (
                    <SuspenseWrapper>
                        <PrivacyPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'terms',
                element: (
                    <SuspenseWrapper>
                        <TermsPage />
                    </SuspenseWrapper>
                ),
            },

            // Guest-only routes
            {
                path: 'login',
                element: (
                    <GuestRoute>
                        <SuspenseWrapper>
                            <LoginPage />
                        </SuspenseWrapper>
                    </GuestRoute>
                ),
            },
            {
                path: 'register',
                element: (
                    <GuestRoute>
                        <SuspenseWrapper>
                            <RegisterPage />
                        </SuspenseWrapper>
                    </GuestRoute>
                ),
            },

            // Protected routes (auth required)
            {
                path: 'profile/:id',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <ProfilePage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'saved',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <SavedPetsPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'my-listings',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <MyListingsPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'settings',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <SettingsPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'reports',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <MyReportsPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'pets/new',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <CreateListingPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'pets/:id/edit',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <EditPetPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'chat',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <ChatPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'chat/:conversationId',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <ChatPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'notifications',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <NotificationsPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'community',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <CommunityPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'community/:postId',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <CommunityPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'reviews',
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <ReviewsPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
        ],
    },

    // Admin routes (admin role required)
    {
        path: 'admin',
        element: (
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                element: (
                    <SuspenseWrapper>
                        <AdminDashboardPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'users',
                element: (
                    <SuspenseWrapper>
                        <AdminUsersPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'pets',
                element: (
                    <SuspenseWrapper>
                        <AdminPetsPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'reports',
                element: (
                    <SuspenseWrapper>
                        <AdminReportsPage />
                    </SuspenseWrapper>
                ),
            },
        ],
    },

    // 404 Catch-all
    {
        path: '*',
        element: (
            <SuspenseWrapper>
                <NotFoundPage />
            </SuspenseWrapper>
        ),
    },
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;