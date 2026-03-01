import type { ReactNode } from 'react';

interface ContentPageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ContentPage({ title, description, children }: ContentPageProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{title}</h1>
        <p className="mt-4 text-base text-gray-600">{description}</p>
        <div className="mt-8 space-y-8 text-gray-700">{children}</div>
      </div>
    </section>
  );
}
