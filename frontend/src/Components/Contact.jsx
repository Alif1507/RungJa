import React from 'react'

const Contact = () => {
  return (
    <section className='mt-64'>
      <div className='font-poppins-700 text-[#2C3E50] flex flex-col justify-center items-center text-center mb-20'>
        <h1 className='text-2xl'>Ingin menanyakan sesuatu? Atau ingin memberikan saran?</h1>
        <p className=''>Kontak kami dibawah sini!</p>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-row justify-center gap-10'>
          <div>
          <h1>Email</h1>
          <input className='px-8 py-2 bg-[D9D9D9]/60 border border-[#E67E22] rounded-xl' type="email" placeholder='RungJa@sija.com' />
          </div>
          <div>
          <h1>Nama</h1>
          <input className='px-8 py-2 bg-[D9D9D9]/60 border border-[#E67E22] rounded-xl' type="text" placeholder='Alvin' />
          </div>
        </div>
        <div className='flex flex-col justify-center items-center mt-5'>
          <textarea className='w-[285%] min-h-[187px] bg-[D9D9D9]/60 border border-[#E67E22] rounded-xl' name="" id="">
          Tulis pesanmu disini...
          </textarea>
        </div>
        <button className='bg-[#E67E22] text-white w-[600px] rounded-2xl font-poppins-700 h-[50px] mt-5'>
          Kirim
        </button>
      </div>
    </section>
  )
}

export default Contact
