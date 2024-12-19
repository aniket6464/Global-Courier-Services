import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <header className="bg-gray-800 text-white">
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    <Link to="/" className="text-2xl font-bold">Global Courier</Link>
    <nav className="hidden md:flex space-x-6">
      <Link to="/" className="hover:text-yellow-400">Home</Link>
      <Link to="/customer-sign-in" className="hover:text-yellow-400">Track Parcel</Link>
      <Link to="/" className="hover:text-yellow-400">About Us</Link>
      <Link to="/sign-up" className="hover:text-yellow-400">Sign Up</Link>
      <Link to="/customer-sign-in" className="hover:text-yellow-400">Login</Link>
    </nav>
    <div className="hidden md:flex items-center">
      <input
        type="text"
        placeholder="Track your parcel"
        className="rounded-l-md px-3 py-2 border border-gray-700 bg-gray-900 text-white focus:outline-none"
      />
      <button className="rounded-r-md px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-medium">
        Track
      </button>
    </div>
  </div>
      </header>

      <section className="relative bg-gray-800 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('./background_image_1.webp')" }}
        >
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
        </div>
        <div className="relative container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">Fast, Reliable, and Global</h1>
          <p className="mt-4 text-lg md:text-xl">Delivering Beyond Borders with Speed and Security</p>
          <div className="mt-8 space-x-4">
            <Link
              to="/"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold rounded-lg shadow-md"
            >
              Request a Pickup
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 font-semibold rounded-lg shadow-md"
            >
              Learn More
            </Link>
          </div>
          <div className="mt-12 flex justify-center items-center">
            <input
              type="text"
              placeholder="Enter Parcel ID"
              className="w-full max-w-md px-4 py-3 rounded-l-lg border border-gray-700 bg-gray-900 text-white focus:outline-none"
            />
            <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold rounded-r-lg">
              Track Now
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Our Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h11M9 21V3M17 16h5m0 0v-5m0 5l-5-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Track Parcels</h3>
              <p className="text-gray-600">Parcel tracking to keep you informed at every step.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M9 21v-6m6 6v-6M12 10v4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Global Coverage</h3>
              <p className="text-gray-600">Delivering to over 150 countries with reliable service.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Secure Deliveries</h3>
              <p className="text-gray-600">All parcels are insured and handled with care.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l-4-4m0 0l4-4m-4 4h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our team is available around the clock to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
              <img src="./Express_Delivery.webp" alt="Express Delivery" className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Express Delivery</h3>
              <p className="text-gray-600">Get your parcels delivered within 1-2 days with our fast delivery service.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
              <img src="./Standard_Shipping.webp" alt="Standard Shipping" className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Standard Shipping</h3>
              <p className="text-gray-600">Affordable shipping option with reliable delivery timelines.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
              <img src="./International_Shipping.webp" alt="International Shipping" className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">International Shipping</h3>
              <p className="text-gray-600">We deliver parcels worldwide, ensuring they reach their destination safely.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
              <img src="./Parcel_Insurance.webp" alt="Parcel Insurance" className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Parcel Insurance</h3>
              <p className="text-gray-600">Protect your valuables with our insurance service for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">© 2024 Global Courier Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
