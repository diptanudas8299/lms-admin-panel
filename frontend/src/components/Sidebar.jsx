import { NavLink } from "react-router-dom";

const links = [
  { path: "/", label: "Dashboard", end: true },
  { path: "/teachers", label: "Teachers" },
  { path: "/courses", label: "Courses" },
  { path: "/classes", label: "Classes" },
  { path: "/students", label: "Students" },
  { path: "/parents", label: "Parents" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 font-bold text-xl border-b border-gray-800">
        Admin Panel
      </div>

      <nav className="flex-1 flex flex-col">
        {links.map(({ path, label, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `px-4 py-2 transition ${
                isActive
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-800"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
