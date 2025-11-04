import React from 'react'

const Hero = () => {
  return (
    <section className='relative mb-130'>
      <div className='absolute -bottom-130 z-10 w-full'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#2C3E50" fill-opacity="1" d="M0,256L24,213.3C48,171,96,85,144,96C192,107,240,213,288,240C336,267,384,213,432,160C480,107,528,53,576,64C624,75,672,149,720,165.3C768,181,816,139,864,112C912,85,960,75,1008,106.7C1056,139,1104,213,1152,234.7C1200,256,1248,224,1296,213.3C1344,203,1392,213,1416,218.7L1440,224L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path></svg>
      </div>
      <nav className='flex flex-row justify-around items-center p-6'>
        <div className='flex flex-row items-center gap-2'>
          <img src="./img/logo.png" alt="LOGO" />
          <h1 className='text-6xl font-milonga'>RungJa</h1>
        </div>
        <div>
          <ul className='flex flex-row gap-6 font-manrope font-bold'>
            <li><a href="#home">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <button className='text-white bg-[#E67E22] font-bold p-4 text-xl rounded-2xl font-manrope'>Sign Up</button>
        </div>
      </nav>
      <div className='bg-[#56585C]/60 w-screen h-0.5'>.</div>
      <article className='flex flex-row justify-around items-center mt-20 px-20'>
        <div className='flex flex-col'>
          <h1 className='font-manrope text-6xl max-w-[500px]'>Perut Laper? <span className='text-[#E67E22]'>Sokin</span> Ke <span className='font-milonga'>RungJa</span></h1>
          <p ><span className='font-milonga'>RungJa</span> hadir untuk menyediakan makanan enak dan ramah di dompet</p>
        </div>
        <div>
          <img src="./img/makanan.png" alt="makanan" />
        </div>
      </article>
    </section>
  )
}

export default Hero
