export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white mb-2 text-center">Bienvenido</h1>
        <p className="text-gray-400 text-center mb-8">Inicia sesión en CoSpace</p>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400" />
          <input type="password" placeholder="Contraseña" className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition">Entrar</button>
        </form>
      </div>
    </div>
  );
}
