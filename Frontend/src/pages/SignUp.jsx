import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };




  return (
    <div className='pt-24 '>
      <div className='p-5 bg-black max-w-lg mx-auto rounded-lg'>
        <img src="peces.webp" className='rounded-full' alt="" />
        <form onSubmit={handleSubmit} className='flex flex-col mt-3 gap-4'>
          <input
            type='text'
            placeholder='Username'
            id='username'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='Email'
            id='email'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            id='password'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
          />
         <button
            disabled={loading}
            className='flex bg-gray-800 text-white hover:bg-black hover:border-[1px] items-center gap-2 font-bold p-3 rounded-lg uppercase hover:opacity-95'>
            <img className='w-7 h-7' src="/logB.png" alt="" />{loading ? 'loading...' : 'Sign Up'}
            
          </button>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-5'>
          <p className='text-white'>Have an account?</p>
          <Link to='/sign-in'>
            <span className='text-blue-500'>Sign in</span>
          </Link>
        </div>
        <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      </div>
    </div>

  );
}
