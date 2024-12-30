import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js';

function SignIn() {

    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const res = await fetch('api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }            
            dispatch(signInSuccess(data));
            navigate("/dashboard");
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

  return (
    <div className="p-3 max-w-lg mx-auto m-5">
        <h1 className='text-4xl my-7 text-center'>Sign in</h1>
        <form className='gap-4 flex flex-col' onSubmit={handleSubmit}  >
            <input type="email" id='email' placeholder='email' onChange={handleChange}
            className='rounded-lg p-3 outline-none border' />
            <input type="password" id='password' placeholder='password' onChange={handleChange}
            className='rounded-lg p-3 outline-none border' />
            <button className='bg-purple-600 rounded-lg p-3 text-white '>
                {loading ? 'Loading...' : 'Sign in'}
            </button>
        </form>
        <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={"/signUp"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn