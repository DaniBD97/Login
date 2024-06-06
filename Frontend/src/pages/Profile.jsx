import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/userSlice.js';
import { toast } from 'react-toastify';
import { faUser, faLock, faEnvelope, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import ChangePassword from '../components/ChangePassword.jsx';
export default function Profile() {

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    setImageError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {

        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
        // Restablecer el estado de éxito después de 3 segundos

      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith("social_")) {
      const socialPlatform = id.split("_")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        socialLinks: {
          ...prevFormData.socialLinks,
          [socialPlatform]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
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
        // Mostrar el mensaje de error recibido del servidor
        toast.error(data.message || 'Update Failed', { autoClose: 2000 });
        dispatch(updateUserFailure(data));
        return;
      }

      // Si todo está bien, despachar el éxito
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success('Update Success', { autoClose: 2000 });

      // Restablecer el estado de éxito después de 3 segundos
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);

    } catch (error) {
      // Manejo de errores de red u otros errores
      dispatch(updateUserFailure(error));
      toast.error('An error occurred', { autoClose: 2000 });
    }
  };


  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) {
      return; // Si el usuario cancela, no hacemos nada
    }

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        toast.error('Failed to delete account', { autoClose: 2000 });
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success('Account deleted successfully', { autoClose: 2000 });
    } catch (error) {
      dispatch(deleteUserFailure(error));
      toast.error('An error occurred', { autoClose: 2000 });
    }
  };


  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='p-3 mx-auto text-center justify-center'>
      <section className='flex border-t-2 mt-[100px] border-black  mx-auto flex-col justify-center text-center'>



        <div className='flex flex-col  md:m-0 sm:text-center sm:justify-center md:flex-row gap-4'>
          <div className='flex flex-col h-screen w-[300px] p-5 justify-start text-start  gap-3  border-r-2 border-black  !sm:border-none  '>
            <h1 className='font-bold '>DashBoard</h1>
            <div className='mt-4 flex  gap-3 flex-col'>
              <span
                onClick={() => setActiveTab('profile')}
                className={`text-black bg-gray-100 p-2 rounded-lg cursor-pointer ${activeTab === 'profile' && 'bg-gray-300'}`}
              >
                Profile
              </span>
              <span
                onClick={() => setActiveTab('Change')}
                className={`text-black bg-gray-100 p-2 rounded-lg cursor-pointer ${activeTab === 'Change' && 'bg-gray-300'}`}
              >
                Change Password
              </span>
              <span
                onClick={handleDeleteAccount}
                className='text-black bg-gray-100 p-2 rounded-lg cursor-pointer'
              >
                Delete Account
              </span>
              <span
                onClick={handleSignOut}
                className='text-black rounded-lg bg-gray-100 p-2 cursor-pointer'
              >
                Sign out
              </span>
            </div>
          </div>
          {/* Profile */}
          <div className='sm:text-center  sm:justify-center'>
            {activeTab === 'profile' && (
              <div>
                <h1 className='font-bold text-left !sm:text-center mt-4 ml-2 !sm:ml-0  '>Profile</h1>

                <form onSubmit={handleSubmit} className='flex mt-4 flex-1 flex-col md:flex-row mx-auto gap-4'>

                  <section className='w-[200px] h-[200px] mx-auto'>
                    <input
                      type='file'
                      ref={fileRef}
                      hidden
                      accept='image/*'
                      onChange={(e) => setImage(e.target.files[0])}
                    />

                    <img
                      src={formData.profilePicture || currentUser.profilePicture}
                      alt='profile'
                      className='h-44 w-44 self-center cursor-pointer rounded-full object-cover mt-2'
                      onClick={() => fileRef.current.click()}
                    />
                    <p className='text-sm self-center'>
                      {imageError ? (
                        <span className='text-red-700'>
                          Error uploading image (file size must be less than 2 MB)
                        </span>
                      ) : imagePercent > 0 && imagePercent < 100 ? (
                        <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
                      ) : !imageError && imagePercent === 100 ? (
                        <span className='text-green-700'>Image uploaded successfully click Update</span>
                      ) : (
                        ''
                      )}
                    </p>
                  </section>

                  <section className='gap-2 text-center justify-center mx-auto flex flex-col w-[450px] md:w-[700px]'>
                    <section className='relative flex items-center gap-2'>
                      <div className='relative flex items-center w-full'>
                        <FontAwesomeIcon
                          icon={faUser}
                          className='absolute left-3'
                        />
                        <input
                          defaultValue={currentUser.username}
                          type='text'
                          id='username'
                          placeholder='Username'
                          className='bg-slate-100 rounded-lg p-3 pl-10 w-full'
                          onChange={handleChange}
                        />
                      </div>
                      {error && error.field === 'username' && (
                        <p className='text-red-700'>{error.message}</p>
                      )}
                    </section>



                    <section className='relative flex items-center gap-2'>
                      <div className='relative flex items-center w-full'>
                        <FontAwesomeIcon className='absolute left-3' icon={faEnvelope} />
                        <input
                          defaultValue={currentUser.email}
                          type='email'
                          id='email'
                          placeholder='Email'
                          className='bg-slate-100 rounded-lg p-3 pl-10 w-full'
                          onChange={handleChange}
                        />
                      </div>

                      {error && error.field === 'email' && (
                        <p className='text-red-700'>{error.message}</p>
                      )}
                    </section>


                    <article className='gap-1 flex flex-col mt-9'>
                      <h1 className='flex text-left mt-2 mb-2 font-bold'>Social Links</h1>
                      <section className='relative flex items-center gap-2'>
                        <div className='relative flex items-center w-full'>
                          <FontAwesomeIcon className='absolute left-3' icon={faGithub} />
                          <input
                            defaultValue={currentUser.socialLinks.github}
                            type='text'
                            id='social_github'
                            placeholder='https://Github.com/'
                            className='bg-slate-100 rounded-lg p-3 pl-10 w-full'
                            onChange={handleChange}
                          />
                        </div>

                        {error && error.field === 'social_github' && (
                          <p className='text-red-700'>{error.message}</p>
                        )}
                      </section>
                      <section className='relative flex items-center gap-2 '>
                        <div className='relative flex items-center w-full'>
                          <FontAwesomeIcon className='absolute left-3' icon={faInstagram} />

                          <input
                            defaultValue={currentUser.socialLinks.instagram}
                            type='text'
                            id='social_instagram'
                            placeholder='https://Instagram.com/'
                            className='bg-slate-100 rounded-lg p-3 pl-10 w-full'
                            onChange={handleChange}
                          />
                        </div>

                        {error && error.field === 'social_instagram' && (
                          <p className='text-red-700'>{error.message}</p>
                        )}
                      </section>

                      <section className='relative flex items-center gap-2'>
                        <div className='relative flex items-center w-full'>
                          <FontAwesomeIcon className='absolute left-3' icon={faLinkedin} />
                          <input
                            defaultValue={currentUser.socialLinks.linkedin}
                            type='text'
                            id='social_linkedin'
                            placeholder='https://LinkedIn.com/'
                            className='bg-slate-100 rounded-lg p-3 pl-10 w-full'
                            onChange={handleChange}
                          />
                        </div>

                        {error && error.field === 'social_linkedin' && (
                          <p className='text-red-700'>{error.message}</p>
                        )}
                      </section>

                    </article>
                    <section className='flex justify-end'>
                      <button className='bg-black w-[150px] items-center flex text-center justify-center h-[30px] text-white p-3 rounded-lg uppercase hover:bg-gray-800 hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Loading...' : 'Update Profile'}
                      </button>

                    </section>


                    {/* <article className=''>
      <h1 className='text-left mt-2 mb-2 font-bold'>Change Password</h1>
      <section className='relative flex items-center gap-2'>
        <div className='relative flex items-center w-full'>
          <FontAwesomeIcon className='absolute left-3' icon={faLock} />
          <input
            type='password'
            id='password'
            placeholder='Password'
            className='bg-slate-100 rounded-lg p-3 pl-10 w-full'
            onChange={handleChange}
          />
        </div>

        {error && error.field === 'password' && (
          <p className='text-red-700'>{error.message}</p>
        )}
      </section>
    </article> */}








                    <p className='text-red-700 mt-5'>
                      {error && error.field !== 'username' && error.field !== 'email' && error.field !== 'social_github' && error.field !== 'social_instagram' && error.field !== 'social_linkedin' && error.field !== 'password' && 'Something went wrong!'}
                    </p>
                    <p className='text-green-700 mt-5'>
                      {updateSuccess && 'User is updated successfully!'}
                    </p>

                  </section>

                </form>
              </div>)}
            {activeTab === 'Change' && (
              <div className='flex mt-4  ml-10 flex-col md:flex-row mx-auto gap-4'>

                <ChangePassword  currentUser={currentUser} />

              </div>
            )}


          </div>
          {/*End Profile */}
          {/* Change Password */}


          {/* End Change Password */}

        </div>
      </section>
    </div>
  );
}
