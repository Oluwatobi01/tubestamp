'use client';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">
            <a href="#" className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">TubeStamp</a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex gap-6 text-sm text-gray-300">
            <a className="hover:text-white" href="#features">Features</a>
            <a className="hover:text-white" href="#preview">Preview</a>
            <a className="hover:text-white" href="#about">About</a>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center rounded-md border border-gray-800 bg-gray-900 p-2 text-gray-200 hover:bg-gray-800"
          >
            {open ? (
              // X icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="sm:hidden mt-3 grid gap-2 text-sm text-gray-300">
            <a className="rounded-md px-3 py-2 hover:bg-gray-900" href="#features" onClick={() => setOpen(false)}>Features</a>
            <a className="rounded-md px-3 py-2 hover:bg-gray-900" href="#preview" onClick={() => setOpen(false)}>Preview</a>
            <a className="rounded-md px-3 py-2 hover:bg-gray-900" href="#about" onClick={() => setOpen(false)}>About</a>
          </nav>
        )}
      </div>
    </header>
  );
}
