import React from 'react'

function Menu() {
  const menus = [
    {
      nama: "Spaghetti",
      harga: "Rp7.000",
      img: "./menu/spagetti.png"
    },

    {
      nama: "Mi Ayam",
      harga: "Rp12.000",
      img: "./menu/miAyam.png"
    },

    {
      nama: "Kwetiau",
      harga: "Rp7.000",
      img: "./menu/kwetiau.png"
    },

    {
      nama: "Ketoprak",
      harga: "Rp7.000",
      img: "./menu/ktoprak.png"
    },

  ]
  return (
    <section id='menu' className='relative'>
      <div className='flex flex-row justify-center gap-20 mt-40'>
        <div>
        <img src="./img/nasiGoreng.png" alt="" />
        </div>
        <div className='font-montserrat flex text-6xl font-bold flex-col'>
          <div className=''>
            <h1>Nasi Goreng</h1>
            <button className='text-xl text-white bg-[#E67E22] py-1 px-3 rounded-2xl'>Favorite</button>
          </div>
          <h1 className='mt-20'>Rp. 7.000</h1>
        </div>
      </div>

      <div className='flex flex-row justify-center gap-10 mt-20'>
        {menus.map((menu, index) => (
          <div key={index} className='w-[222px] h-[315px] flex flex-col border shadow-2xl rounded-2xl'>
          <img src={menu.img} alt="makanan1" />
          <div className='flex flex-col gap-2 mx-3'>
            <h1>{menu.nama}</h1>
          <h1>{menu.harga}</h1>
          <button className='text-white bg-[#E67E22] py-1 px-5 font-manrope rounded-2xl'>Tambahkan</button>
          </div>
        </div>
        ))}
      </div>
    </section>
  )
}

export default Menu
