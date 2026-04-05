import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import Detail from './pages/Detail'
import About from './pages/About'
import Suggest from './pages/Suggest'
import AdminSuggestions from './pages/AdminSuggestions'
import Login from './pages/Login'
import MapPage from './pages/MapPage'
import Favorites from './pages/Favorites'

function App() {
  return (
    <Router>
      <Toaster position="bottom-center" />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search.html" element={<Search />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/detail.html" element={<Detail />} />
          <Route path="/about" element={<About />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/suggest" element={<Suggest />} />
          <Route path="/suggest.html" element={<Suggest />} />
          <Route path="/admin/suggestions" element={<AdminSuggestions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
