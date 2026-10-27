export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Control Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Ocupación Hoy</h3>
          <p className="text-3xl font-bold">85%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Ingresos este mes</h3>
          <p className="text-3xl font-bold">$12,450</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Reservas Pendientes</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Reservas Recientes</h2>
        <p className="text-gray-500">Aquí iría una tabla con las últimas reservas...</p>
      </div>
    </div>
  );
}
