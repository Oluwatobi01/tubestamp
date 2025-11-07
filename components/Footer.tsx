export default function Footer() {
  return (
    <footer id="about" className="mt-16 border-t border-gray-800/60">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} <span className="text-gray-300">TubeStamp</span>. Built to make chaptering fast and easy.
        </p>
      </div>
    </footer>
  );
}
