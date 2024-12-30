import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      };
      

    const handleSubmit = async (e) => {        
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                return;
            }
            setLoading(false);
            setError(null);
            navigate('/signin');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

  return (
    <div className="p-3 max-w-lg mx-auto m-5">
        <h1 className='text-center my-7 text-4xl'>Create an account!</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <input type="text" placeholder="username" id='username'
            onChange={handleChange}
            className='border rounded-lg p-3 outline-none '/>
            <input type="email" placeholder="email" id='email'
            onChange={handleChange}
            className='border rounded-lg p-3 outline-none '/>
            <input type="password" placeholder="password" id='password'
            onChange={handleChange}
            className='border rounded-lg p-3 outline-none '/>
            <button
                disabled={loading} className='bg-purple-600 border rounded-lg p-3 text-white font-medium'>
                {loading ? 'Loading...' : 'Sign Up'}
            </button>
            <div className="flex gap-2">
                <p className='text-center'>Already have an account? </p>
                <Link to={"/signin"}>
                    <span  className='text-blue-700 font-medium'>Sign in</span>
                </Link>
            </div>
        </form>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp