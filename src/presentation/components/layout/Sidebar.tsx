'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <aside className="w-64 bg-indigo-700 dark:bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-indigo-800 dark:border-gray-700">
        <Link href="/" className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-bold text-xl">MetricsHub</span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <h5 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
            General
          </h5>
        </div>
        <ul className="space-y-1 px-2">
          <li>
            <Link 
              href="/"
              className={`flex items-center px-4 py-2 text-white rounded-md ${
                isActive('/') && !isActive('/github') ? 'bg-indigo-800 dark:bg-gray-700' : 'hover:bg-indigo-600 dark:hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </Link>
          </li>
        </ul>

        <div className="px-4 mt-6 mb-2">
          <h5 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
            GitHub Copilot
          </h5>
        </div>
        <ul className="space-y-1 px-2">
          <li>
            <Link 
              href="/github/copilot"
              className={`flex items-center px-4 py-2 text-white rounded-md ${
                isActive('/github/copilot') && !isActive('/github/copilot/users') && !isActive('/github/copilot/repositories') 
                  ? 'bg-indigo-800 dark:bg-gray-700' 
                  : 'hover:bg-indigo-600 dark:hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Overview</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/github/copilot/users"
              className={`flex items-center px-4 py-2 text-white rounded-md ${
                isActive('/github/copilot/users') ? 'bg-indigo-800 dark:bg-gray-700' : 'hover:bg-indigo-600 dark:hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/github/copilot/repositories"
              className={`flex items-center px-4 py-2 text-white rounded-md ${
                isActive('/github/copilot/repositories') ? 'bg-indigo-800 dark:bg-gray-700' : 'hover:bg-indigo-600 dark:hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>Repositories</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
