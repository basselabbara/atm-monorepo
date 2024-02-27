import styles from './app.module.scss';
import Atm from './components/Atm';
import Cs from './components/CS';

export function App() {
  return (
    <div className={styles.wrapper}>
      <Atm />
      <Cs />
    </div>
  );
}

export default App;
