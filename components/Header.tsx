export default function Header() {
  return (
    <header className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">
            <span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">TubeStamp</span>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm text-gray-300">
            <a className="hover:text-white" href="#features">Features</a>
            <a className="hover:text-white" href="#preview">Preview</a>
            <a className="hover:text-white" href="#about">About</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
