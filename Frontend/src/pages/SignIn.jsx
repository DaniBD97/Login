import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
export default function SignIn() {

  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();


      if (data.success === false) {

        dispatch(signInFailure(data.message));
        return;

      }
      dispatch(signInSuccess(data))
      navigate('/');

    } catch (error) {

      dispatch(signInFailure(error))
    }


    console.log(data);

  };





  return (
    <div className='pt-24 pl-48 slide-left formS '>
      <div className='p-5 shadow-black shadow-2xl bg-[#000000] rounded-3xl  max-w-lg md:max-w-xl mx-auto'>
        <img className='mx-auto w-56 h-56' src="/pecera.gif" alt="" />

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='input-container'>
            <input
              className='p-3 rounded-lg border-slate-300 border-[1px]'
              onChange={handleChange}
              type="email"
              id='email'
              placeholder=' '
            />
            <label className='floating-label' htmlFor='email '>Enter your email </label>
          </div>
          <div className='input-container'>
            <input
              className='p-3 rounded-lg border-slate-300 border-[1px]'
              onChange={handleChange}
              type="password"
              id='password'
              placeholder=' '
            />
            <label className='floating-label' htmlFor='password'>Enter your Password </label>
          </div>
          <button
            disabled={loading}
            className='flex bg-gray-800 text-white hover:bg-black hover:border-[1px] items-center gap-2 font-bold p-3 rounded-lg uppercase hover:opacity-95'>
            <img className='w-7 h-7' src="/logB.png" alt="" />{loading ? 'loading...' : 'Sign In'}
            
          </button>

          <OAuth />
        </form>
        <div className='flex mt-2 gap-2'>
          <p className='text-white'>Dont Have an account?</p>

          <Link to='/sign-up'>
            <span className='text-blue-500 '>Sign Up</span>
          </Link>

        </div>
        <p className='text-red-700'>{error ? error.message || "Something went wrong!" : ''}</p>

      </div>


    </div>
  )
}
