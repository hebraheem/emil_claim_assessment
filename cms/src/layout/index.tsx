import { Outlet } from "react-router";
import { PATHS } from "../routes/paths";

const links = [
  {
    name: "Dashboard",
    href: PATHS.CLAIMS,
    icon: "🏠",
    className:
      "block px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition",
  },
  {
    name: "Create Claim",
    href: PATHS.CREATE_CLAIM,
    icon: "➕",
    className:
      "block px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-semibold transition",
  },
  {
    name: "Configuration",
    href: PATHS.CONFIG,
    icon: "⚙️",
    className:
      "block px-4 py-2 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold transition",
  },
];

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg py-6 px-8 mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-lg">
          🎨 Claim Assessment
        </h1>
      </header>
      <main className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1 bg-white/80 rounded-xl shadow p-6 flex flex-col items-center max-h-96">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 to-blue-400 flex items-center justify-center mb-4">
              <span className="text-3xl text-white font-bold">CA</span>
            </div>
            <nav className="w-full">
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className={link.className}>
                      <span className="text-lg font-semibold text-gray-700">
                        {link.icon} {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <section className="md:col-span-3 bg-white/90 rounded-xl shadow p-8 min-h-[70vh] overflow-auto max-h-[73vh]">
            <Outlet />
          </section>
        </div>
      </main>
      <footer className="mt-12 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Claim Assessment App
      </footer>
    </div>
  );
};

export default Layout;
