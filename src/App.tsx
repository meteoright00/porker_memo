import { Routes, Route } from 'react-router-dom';
import TopPage from './pages/TopPage';
import { HandRecordingPage } from './pages/HandRecordingPage';
import TournamentListPage from './pages/TournamentListPage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

import TournamentCreatePage from './pages/TournamentCreatePage';
import TournamentDetailPage from './pages/TournamentDetailPage';

import { Toaster } from '@/components/ui/toaster';

function App() {
    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<TopPage />} />
                    <Route path="/record" element={<HandRecordingPage />} />
                    <Route path="/tournaments" element={<TournamentListPage />} />
                    <Route path="/tournaments/new" element={<TournamentCreatePage />} />
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
                <Toaster />
            </div>
        </ErrorBoundary>
    )
}

export default App
