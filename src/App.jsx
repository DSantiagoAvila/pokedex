import { AuthProvider } from './context/AuthContext';
import { PokedexProvider } from './context/PokedexContext';
import { Navbar } from './components/Navbar/Navbar';
import { PokemonModal } from './features/pokemon/PokemonModal';
import PokedexPage from './features/pokedex/PokedexPage';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <PokedexProvider>
        <Navbar />
        <PokedexPage />
        <PokemonModal />
      </PokedexProvider>
    </AuthProvider>
  );
}
