export default function CTAGrid() {
  const items = [
    {
      title: 'Paste URL',
      desc: 'Drop in a YouTube link to analyze video chapters.',
    },
    {
      title: 'Generate Timestamps',
      desc: 'We create clean, shareable chapter timestamps automatically.',
    },
    {
      title: 'Copy & Share',
      desc: 'Export timestamps for descriptions, notes, and social posts.',
    },
  ];
  return (
    <section id="features" className="container-max py-12">
      <h2 className="text-2xl font-semibold">How it works</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow">
            <h3 className="text-lg font-semibold text-white">{it.title}</h3>
            <p className="mt-2 text-sm text-gray-400">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
