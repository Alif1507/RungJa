import React from 'react'
import Marquee from "react-fast-marquee";

const Testi = () => {
  const testimonial = [
    {
      name: "Fahmi",
      text: "T“Tempat bersih, nyaman, makanan fresh. Sambalnya juara, harganya juga masuk akal”"
    },
    {
      name: "Bambang",
      text: "“Rasa nendang, bumbu pas, porsi mantap. Pelayanan cepat dan ramah—wajib balik lagi!”"
    },
    {
      name: "onana",
      text: "“Datang rame tetap cepat disajikan. Gurih-pedasnya pas, cocok buat keluarga”"
    },

    {
      name: "hariz",
      text: "“Value for money! Staff helpful, menu variatif, semua yang dicoba enak tanpa gagal”"
    },
  ]
  return (
    <section className='bg-[#2C3E50] text-white h-[900px] relative'>
      
      <div>
        <main className='flex flex-row'>
            <Marquee >
              {testimonial.map((item, index) => (
                <div key={index} className='flex flex-col justify-center items-center p-20 gap-6'>
              <h1>{item.name}</h1>
              <p>{item.text}</p>
              <img src="./img/bintang.png" alt="" />
            </div>
              ))}
            </Marquee>
        </main>   
        <main className='flex flex-row items-center justify-around'>
              <img src="./img/koki.png" alt="koki" />
              <p className='max-w-[438px] text-white text-2xl font-manrope'>
                RungJa adalah restoran rumahan-modern yang menyajikan masakan Nusantara dengan sentuhan kreatif. Kami percaya pada tiga hal: rasa yang jujur, bahan segar, dan pelayanan hangat. Dari dapur terbuka kami, tiap hidangan dimasak pesanan—aroma wajan, bumbu yang kaya, dan plating rapi jadi ciri khas RungJa. Cocok untuk makan keluarga, temu teman, atau santai sambil ngopi.
              </p>
        </main>
      </div>
    </section>
  )
}

export default Testi
