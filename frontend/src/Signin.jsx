import React from 'react'
import SignInCard from './Components/SignInCard'

const Signin = () => {
  return (
    <main className='flex flex-row justify-around items-center h-screen w-screen relative'>
      <div className='flex flex-col'>
        <img src="./img/logo.png" alt="LOGO" />
        <h1 className='text-7xl font-milonga'>RungJa</h1>
      </div>
      <div className='w-[25%]'>
        <SignInCard />
      </div>
      <div className='h-screen absolute w-0.5 bg-gray-200' />
    </main>
  )
}

export default Signin
