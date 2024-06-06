import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Header() {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='max-w-full w-full fixed bg-white z-[999]'>
      <div className=' w-[600px] md:w-[800px] md:p-3 mx-auto   flex flex-row items-center justify-between '>
        <Link  to='/'>
          <img className='mr-5 w-20 h-20' src="/Da.png" alt="" />
        </Link>
        <ul className='flex gap-4'>
          <Link className='hover:bg-slate-300 transition-all  rounded-lg p-2 ' to='/'>
            <li>Home</li>
          </Link>

          {!currentUser ?
            (<Link className='hover:bg-slate-300 transition-all  rounded-lg p-2' to='/about'>
              <li>About</li>
            </Link>) :
            (<Link className='hover:bg-slate-300 transition-all  rounded-lg p-2' to='/profile'>
              <li>Profile</li>
            </Link>)}

          <Link className='hover:bg-slate-300 transition-all  rounded-full p-2' to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
