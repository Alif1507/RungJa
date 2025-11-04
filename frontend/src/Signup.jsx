import React from 'react'
import SignUpCard from './Components/SignUpCard'

const Signup = () => {
  return (
    <main className='flex flex-row justify-around items-center h-screen w-screen relative'>
      <div className='flex flex-col'>
        <img src="./img/logo.png" alt="LOGO" />
        <h1 className='text-7xl font-milonga'>RungJa</h1>
      </div>
      <div className='w-[25%]'>
        <SignUpCard />
      </div>
      <div className='h-screen absolute w-0.5 bg-gray-200' />
    </main>
  )
}

export default Signup
