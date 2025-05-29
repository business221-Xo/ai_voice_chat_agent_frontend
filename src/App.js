import logo from './logo.svg';
import './App.css';
// import Pack3000Widget from './component/Pack3000Widget_new';
import Pack3000WidgetNew from './component/Pack3000WidgeNew';
// import Pack3000WidgetOld from './component/Pack3000WidgetOld';
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
          href="https://www.softwaredevelopmentgroup.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          Your Assistant
        </a>
      </header>

      <div>
          <Pack3000WidgetNew />
          {/* <Pack3000WidgetOld /> */}
      </div>
    </div>
  );
}

export default App;
