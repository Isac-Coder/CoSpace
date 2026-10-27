export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080d18] px-4 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Sobre CoSpace</h1>
        <p className="mt-6 text-lg leading-8 text-slate-400">
          En CoSpace, nos dedicamos a facilitar la conexión entre personas y espacios de trabajo productivos. 
          Creemos que el entorno adecuado es fundamental para desbloquear el potencial creativo y profesional.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <h2 className="text-xl font-semibold">Nuestra Misión</h2>
                <p className="mt-4 text-sm text-slate-400">Democratizar el acceso a espacios de trabajo de alta calidad.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <h2 className="text-xl font-semibold">Nuestra Visión</h2>
                <p className="mt-4 text-sm text-slate-400">Ser la plataforma líder de gestión de espacios de trabajo colaborativos.</p>
            </div>
        </div>
      </div>
    </main>
  );
}
