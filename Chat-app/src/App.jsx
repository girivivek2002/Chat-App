
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Chats from './components/pages/Chats';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';



function App() {


  return (
    <div className='App'>

      <Routes>
        <Route path='/'
          element={<Home />} />
        <Route path='/chats'
          element={<Chats />} />
        <Route path='/login'
          element={<Login />} />
        <Route path='/register'
          element={<Register />} />
      </Routes>

    </div>
  )
}

export default App
