import SearchBar from "../components/SearchBar/SearchBar";
import WatchlistSidebar from "../components/Watchlist/WatchlistSidebar";
import StockList from "../components/Watchlist/StockList";

const Dashboard = () => {
  return (
    <div className="flex h-screen">

      <WatchlistSidebar />

      <main className="flex-1 overflow-auto">

        <div className="border-b p-4">

          <SearchBar />

        </div>

        <StockList />

      </main>

    </div>
  );
};

export default Dashboard;