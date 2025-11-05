import React from 'react'
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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

    {
      nama: "Es Teh",
      harga: "Rp3.000",
      img: "https://imgx.sonora.id/crop/0x0:0x0/360x240/photo/2024/03/28/64e59deb79bfbjpg-20240328093740.jpg"
    },

    {
      nama: "Air Mineral",
      harga: "Rp2.000",
      img: "https://dbesto.id/wp-content/uploads/2024/09/PRIMA-330ML.jpg"
    },

    {
      nama: "Es Jeruk",
      harga: "Rp5.000",
      img: "https://img-global.cpcdn.com/steps/c96f03b545e439ef/400x400cq80/photo.jpg"
    },

    {
      nama: "Es Kelapa",
      harga: "Rp7.000",
      img: "https://asset.kompas.com/crops/OXAzgcApgpVuL-F1IXJuTMxkjog=/0x0:1000x667/1200x800/data/photo/2023/06/30/649e2993748d4.jpeg"
    },

  ]

  const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const clickHAndler = () => {
  Toast.fire({
    icon: "success",
    title: "Added to cart"
  })
}
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

      <div className='grid grid-cols-4 grid-rows-2 place-items-center gap-y-20 gap-1 mt-20'>
        {menus.map((menu, index) => (
          <div key={index} className='w-[222px] h-[315px] flex flex-col border shadow-2xl rounded-2xl'>
          <img src={menu.img} alt="makanan1" className='h-[60%]' />
          <div className='flex flex-col gap-2 mx-3'>
            <h1>{menu.nama}</h1>
          <h1>{menu.harga}</h1>
          <button onClick={clickHAndler} className='text-white bg-[#E67E22] py-1 px-5 font-manrope rounded-2xl'>Tambahkan</button>
          </div>
        </div>
        ))}
      </div>
    </section>
  )
}

export default Menu
