export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#070A10] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl text-center text-sm text-[#D6D6D6]/70">
        © {year} made by Tanishk Khare with ❤️
      </div>
    </footer>
  );
}
