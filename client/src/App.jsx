import React, { useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import TaskList from './pages/TaskList'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute'


function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route element={<PrivateRoute />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/tasks' element={<TaskList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App