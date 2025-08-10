import { useNavigate } from "react-router";
import { PATHS } from "../../routes/paths";

const Claims = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Claims Overview</h2>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-4 gap-3 sm:gap-0 justify-between">
        <input
          placeholder="Search claims"
          type="search"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={() => {
            navigate(PATHS.CREATE_CLAIM);
          }}
          className="sm:ml-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
        >
          + Add Claim
        </button>
      </div>
    </div>
  );
};

export default Claims;
