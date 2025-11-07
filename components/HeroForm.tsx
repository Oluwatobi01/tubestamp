export default function HeroForm() {
  return (
    <form className="mx-auto w-full max-w-2xl">
      <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-300">
        YouTube URL
      </label>
      <div className="flex items-center gap-2">
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-gray-100 placeholder:text-gray-500 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
        >
          Generate
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-400">Paste a YouTube link and we’ll generate clean chapter timestamps.</p>
    </form>
  );
}
