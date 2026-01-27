import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Tailwind Test Page
        </h1>

        <p className="text-gray-600 mb-6">
          Nếu bạn thấy giao diện này có màu, Tailwind đã hoạt động 🎉
        </p>

        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App
