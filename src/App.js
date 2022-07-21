import logo from './logo.svg';
import './App.css';
import Iot from './components/Iot';
import MQTTClintInterface from './components/Mqtt';
function App() {
  return (
    <div className="App">
      <Iot /> 
      <MQTTClintInterface />
    </div>
  );
}

export default App;
