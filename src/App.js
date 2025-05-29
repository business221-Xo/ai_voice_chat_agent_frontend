import logo from './logo.svg';
import './App.css';
// import Pack3000Widget from './component/Pack3000Widget_new';
import Pack3000WidgetNew from './component/Pack3000WidgeNew';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <a
          className="App-link"
          href="https://pack3000.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pack3000
        </a>
      </header>

      <div>
          <Pack3000WidgetNew />
      </div>
    </div>
  );
}

export default App;
