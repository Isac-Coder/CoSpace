export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white mb-2 text-center">Registro</h1>
        <p className="text-gray-400 text-center mb-8">Crea tu cuenta en CoSpace</p>
        <form className="space-y-4">
          <input type="text" placeholder="Nombre completo" className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400" />
          <input type="email" placeholder="Email" className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400" />
          <input type="password" placeholder="Contraseña" className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400" />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition">Registrarse</button>
        </form>
      </div>
    </div>
  );
}
