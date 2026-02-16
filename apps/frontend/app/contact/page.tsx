import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Contact | Global PDF Services",
  description:
    "Get in touch with Tanishk Khare — developer of the Global PDF Translation System.",
};

const contacts = [
  {
    label: "Phone",
    value: "+91 6260 440 241",
    href: "tel:+916260440241",
  },
  {
    label: "Email",
    value: "tanishk16012004@gmail.com",
    href: "mailto:tanishk16012004@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/kharetanishk",
    href: "https://github.com/kharetanishk",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#070A10]">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-[#EDEDED] sm:text-4xl">
              Contact
            </h1>
            <p className="mt-4 text-[#D6D6D6]/80">
              Get in touch with the developer behind Global PDF Services
            </p>
          </header>

          <div className="rounded-2xl border border-white/10 bg-[#0B0F18]/70 p-6 sm:p-8">
            <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#EDEDED]/60">
              Developed by
            </p>
            <h2 className="mb-8 text-2xl font-semibold text-[#EDEDED]">
              Tanishk Khare
            </h2>

            <div className="space-y-6">
              {contacts.map((item) => (
                <div key={item.label}>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#EDEDED]/50">
                    {item.label}
                  </p>
                  {item.href ? (
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-[#EDEDED] underline underline-offset-4 hover:text-white transition-colors"
                    >
                      {item.value}
                    </Link>
                  ) : (
                    <p className="text-[#EDEDED]">{item.value}</p>
                  )}
                </div>
              ))}
            </div>

            <blockquote className="mt-10 border-l-2 border-white/20 pl-5 text-[#D6D6D6]/90 italic">
              <p className="mb-2">
                &ldquo;Hi, this is Tanishk Khare, a software developer from
                Bhilai, and I just want to say &mdash;
              </p>
              <p className="font-semibold not-italic text-[#EDEDED]">
                we are not here to overpace the machines, we are here to
                overpace the person we were yesterday.
              </p>
              <p className="mt-2">&rdquo;</p>
            </blockquote>
          </div>
        </div>
      </main>
    </>
  );
}
