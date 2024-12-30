import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice';

function Header() {

  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message)); 
        return;
      }
      dispatch(signOutSuccess());
      navigate('/signin'); 
    } catch (error) {
      dispatch(signOutFailure(error.message));  
    }
  }; 

  return (
    <header className='shadow-lg'>
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        <div className="flex gap-8">
          <Link to='/dashboard' className='font-extrabold text-purple-600 text-lg'>Dashboard</Link>
          <Link to='/tasks' className='font-extrabold text-gray-800 text-lg'>Task List</Link>
        </div>
        <button onClick={handleSignOut} className='bg-purple-600 p-2 text-white rounded-md font-semibold w-24'>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Header;
