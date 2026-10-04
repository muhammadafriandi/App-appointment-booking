import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome To Prescipto, your trusted Partner in managing your healthcare conveniently and Efficiently at Prescipto. We understand the challenges individuals face when it cames to scheduling doctor appointment and managing their health records</p>

          <p>Prescipto in committed the excellence in healthcare technology. We continously strive to enhance our platform integrating the latest advancements to improve user experience and deliverer superior service. Whether you're booking your first appointment or managing ongoing care. Prescipto is here to support you every step of the way.</p>

          <b className='text-gray-800'>Our Vision</b>

          <p>Our vison at Prescipto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare provides, making it easin for you to access the care you need, when you need it.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>Why <span>Choose Us</span> </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efeciency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalization:</b>
          <p>Tailored recomendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>

    </div>
  )
}

export default About
