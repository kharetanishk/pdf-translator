export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#070A10] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl text-center text-sm text-[#D6D6D6]/70">
        © {year} made by Tanishk Khare with ❤️
      </div>
      <h1 className=" max-w-7xl mx-auto text-center font-black leading-none text-transparent bg-clip-text  bg-gradient-to-b from-[#8c8c8c] via-[#2b2b2b] to-[#010101] opacity-90 text-6xl sm:text-[12rem] md:text-[15rem] -z-[1]">
        GlobalPDF
      </h1>
    </footer>
  );
}
