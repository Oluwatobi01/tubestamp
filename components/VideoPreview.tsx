export default function VideoPreview() {
  return (
    <section id="preview" className="mx-auto w-full max-w-3xl">
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-100">Preview</h2>
        <p className="mt-2 text-sm text-gray-400">Your video details and generated timestamps will appear here.</p>
        <div className="mt-4 h-40 w-full rounded-md border border-dashed border-gray-700/80 bg-gray-900" />
      </div>
    </section>
  );
}
