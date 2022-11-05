import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import clock from '../../utils/clock';
import './home.css';

export default function HomeRoute() {
  return (
    <main>
      <p>{clock()}</p>
      <Navbar />
    </main>
  );
}
