import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import About from './About';

export default function Home() {

  const { currentUser } = useSelector((state) => state.user);
  return (
    <>    {currentUser ?
      (<About />)
      :
      (<div className='pt-56 slide  '>
        <div className='mt-4 mx-auto w-[400px] justify-center text-center flex flex-col gap-5'>
          <img loading='lazy' className=' mx-auto rounded-[999px]' src="/ocean.webp" alt="" />
          <span className='text-[50px] font-extrabold  '>DaniDev</span>
          <Link className='' to="/sign-in">
            <span className=' bg-black custom-btn mx-auto btn-14 justify-center font-bold text-[20px] flex text-white p-5 rounded-3xl w-[400px]'>Sign In</span>
          </Link>
        </div>


      </div>)}</>


  )
}
