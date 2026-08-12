import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRouter from './AppRouter';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const App = () => {
    return (
        <Provider store={store}>
            <GoogleOAuthProvider clientId={googleClientId}>
                <HelmetProvider>
                    <ErrorBoundary>
                        <AppRouter />
                    </ErrorBoundary>
                </HelmetProvider>
            </GoogleOAuthProvider>
        </Provider>
    );
};

export default App;