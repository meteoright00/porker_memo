import { HandRecordingPage } from './pages/HandRecordingPage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100">
                <HandRecordingPage />
            </div>
        </ErrorBoundary>
    )
}

export default App
