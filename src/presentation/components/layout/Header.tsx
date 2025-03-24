'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <h1 className="ml-2 text-xl font-semibold text-gray-800 dark:text-gray-200">GitHub Copilot Metrics Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              JS
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">John Smith</div>
          </div>
        </div>
      </div>
    </header>
  );
}
