import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/userSlice';
import { toast } from 'react-toastify';

const ChangePassword = ({ currentUser }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
    setUpdateSuccess(false);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError(null);
    setUpdateSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError({ field: 'confirmPassword', message: 'Las contraseñas no coinciden' });
      return;
    }

    const formData = { password };

    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || 'Update Failed', { autoClose: 2000 });
        dispatch(updateUserFailure(data));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success('Update Success', { autoClose: 2000 });

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);

    } catch (error) {
      dispatch(updateUserFailure(error));
      toast.error('An error occurred', { autoClose: 2000 });
    }
  };

  return (
    <article className='w-[876px]'>
      <h1 className='font-bold text-left !sm:text-center mt-4 ml-2 !sm:ml-0  '>Change Password</h1>
      <form onSubmit={handleSubmit} className='w-[300px] relative flex flex-col gap-2'>
        <div className='relative flex items-center w-full'>
          <FontAwesomeIcon className='absolute left-3' icon={faLock} />
          <input
            type='password'
            id='password'
            placeholder='Password'
            className='bg-slate-100 rounded-lg p-3 pl-10 w-full'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className='relative flex items-center w-full'>
          <FontAwesomeIcon className='absolute left-3' icon={faLock} />
          <input
            type='password'
            id='confirm_password'
            placeholder='Confirm Password'
            className='bg-slate-100 rounded-lg p-3 pl-10 w-full'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <button
          type='submit'
          className='bg-black w-[180px] items-center flex text-center justify-center h-[30px] text-white p-3 rounded-lg uppercase hover:bg-gray-800 hover:opacity-95 disabled:opacity-80'
        >
          Update Password
        </button>
        {error && error.field === 'confirmPassword' && (
          <p className='text-red-700'>{error.message}</p>
        )}
        {updateSuccess && (
          <p className='text-green-700'>La contraseña ha sido actualizada con éxito.</p>
        )}
      </form>
    </article>
  );
};

export default ChangePassword;
