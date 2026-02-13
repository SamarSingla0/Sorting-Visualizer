import SortingChart from "./components/SortingChart";
import SortingProvider from "./contexts/SortingContext";

/**
 * App component
 * - Wraps the visualizer in the SortingProvider so all children can access sorting state.
 * - Also provides the main page layout and background styling.
 */
function App() {
    return (
        <SortingProvider>
            {/* Full‑page gradient background and centered content container */}
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white-light">
                <div className="container mx-auto px-4 py-8">
                    <SortingChart />
                </div>
            </div>
        </SortingProvider>
    );
}

export default App;
