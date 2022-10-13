import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import HomePage from './components/HomePage';

function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <Routes>
    //       <Route
    //         exact
    //         path="/"
    //         element={<HomePage user={user}/>}
    //       >

    //       </Route>
    //     </Routes>
    //   </div>
    // </Router>

    <div className="App">
      <div className="App-header">
        <HomePage user={user} />
      </div>

    </div>
  );
}

export default App;
