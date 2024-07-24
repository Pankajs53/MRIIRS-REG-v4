import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import homeImage from '../assets/homeimage.jpg';

const homeData = [
  {
    type: 'User',
    typeLink: '/user/prompt',
    description: 'Access your medical records, schedule appointments, and communicate with your healthcare providers.',
  },
  {
    type: 'Coordinator',
    typeLink: '/doctor',
    description: 'View and manage user records, track appointments, and collaborate with other medical professionals.',
  },
  {
    type: 'Admin',
    typeLink: '/admin',
    description: 'Oversee hospital operations, manage staff, and generate reports on patient and doctor activities.',
  },
];

const Home = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row mt-5 p-10 text-white">
      <div className="lg:mt-[60px] lg:w-1/2 mb-3 lg:mb-0">
        {/* Image */}
        <motion.img
          src={homeImage}
          alt="Home"
          loading="lazy"
          className="w-full h-auto rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Fields */}
      <motion.div
        className="lg:w-1/2 p-4 rounded-lg shadow-lg bg-richblue-500 sm:mt-5 lg:mt-0 lg:ml-3"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Get Started</h2>
        <p className="mb-4">Choose An Option:</p>

        <div className="flex flex-col gap-4">
          {homeData.map((data, index) => (
            <Link
              key={index}
              to={data.typeLink}
              className="block p-4 bg-gray-800 rounded-lg hover:bg-richblack-400 transition-colors duration-300 ease-in-out"
              
            >
              <div className="text-lg font-semibold">{data.type}</div>
              <div className="text-sm mt-2">{data.description}</div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
