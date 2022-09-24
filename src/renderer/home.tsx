import Navbar from './components/navbar';
import Clock from './components/clock';
import './App.css';

export default function Home() {
  return (
    <main>
      <Clock />
      <Navbar />
    </main>
  );
}
