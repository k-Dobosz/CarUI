import { Link } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Clock from './components/clock/clock';
import './App.css';

export default function Home() {
  return (
    <main>
      <Clock />
      <Link to="/music">Music</Link>
      <Navbar />
    </main>
  );
}
