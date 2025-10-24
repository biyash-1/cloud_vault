
import React from 'react'

const page = () => {
  return (
    <div className='bg-white border-gray-200 shadow-lg rounded-2xl w-full max-w-md p-10'>
      <h1 className=' text-3xl mb-2 text-center'>Login to your account</h1>

    <div>

      <form action="" className='flex flex-col gap-4 py-3'
      >
        <div className='flex flex-col  '>
          <label htmlFor="">Email</label>
          <input type="text"className='px-2 w-full border border-gray-200 rounded-lg px-2 py-2' placeholder='Enter your email'  />


        </div>
  <div className='flex flex-col '>
          <label htmlFor="">password</label>
          <input type="text"className='px-2 w-full border border-gray-200 rounded-lg py-2' placeholder='Enter your email'  />


        </div>
        <div>
          <button className='bg-amber-600 text-white w-full rounded-lg py-2.5 mt-4 hover:bg-amber-700 transition-all'>Login</button>
        </div>
        <p className='text-center'>Didnt have an account? <a href="/sign-up" className="text-amber-600 font-medium hover:underline">
          signup
        </a></p>

      </form>
    </div>
    </div>
  )
}

export default page
