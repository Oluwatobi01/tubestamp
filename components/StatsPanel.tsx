export default function StatsPanel() {
  const stats = [
    { label: 'Videos processed', value: '1.2k+' },
    { label: 'Avg. save time', value: '5m' },
    { label: 'Accuracy', value: '98%' },
  ];
  return (
    <section className="container-max py-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-800 bg-gray-900/40 p-4 text-center">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs uppercase tracking-wide text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
