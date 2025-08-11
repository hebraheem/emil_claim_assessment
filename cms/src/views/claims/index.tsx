import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { fetchClaims } from "../../services";
import { ClaimDto } from "../../types";
import { formatDate, formatLabel, statusBadgeClass } from "../../utils";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "OPEN", label: "Open" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "CLOSED", label: "Closed" },
];

const Claims = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<ClaimDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<Record<string, any>>({
    page: 1,
    pageSize: PAGE_SIZE,
    search: "",
    status: "",
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getClaims = async () => {
      setLoading(true);
      try {
        const res = await fetchClaims(query);
        setClaims(res.claims || []);
        setTotal(res.meta.total || 0);
      } catch (error: any) {
        alert(
          error.message + " " + JSON.stringify(error.errors || {}, null, 2) ||
            "Failed to fetch claims"
        );
      } finally {
        setLoading(false);
      }
    };
    getClaims();
    // eslint-disable-next-line
  }, [query]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Claims Overview</h2>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-4 gap-3 sm:gap-0 justify-between">
        <div className="flex gap-2 flex-1">
          <input
            placeholder="Search claims"
            type="search"
            value={query.search}
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <select
            value={query.status}
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                status: e.target.value,
                page: 1,
              }))
            }
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            navigate(PATHS.CREATE_CLAIM);
          }}
          className="sm:ml-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
        >
          + Add Claim
        </button>
      </div>
      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading claims...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="py-2 px-4">Claim ID</th>
                <th className="py-2 px-4">Related Policy</th>
                <th className="py-2 px-4">Incident type</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Created At</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    No claims found.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.claimId} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{claim.claimId}</td>
                    <td className="py-2 px-4">{claim.policyId}</td>
                    <td className="py-2 px-4">
                      {formatLabel(claim.incidentType)}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                          claim.status
                        )}`}
                      >
                        {formatLabel(claim.status)}
                      </span>
                    </td>
                    <td className="py-2 px-4">{formatDate(claim.createdAt)}</td>
                    <td className="py-2 px-4">
                      <button
                        className="text-blue-600 hover:underline pr-2"
                        onClick={() =>
                          navigate(
                            `${PATHS.CLAIM_DETAIL.replace(
                              ":id",
                              claim.claimId.toString()
                            )}`
                          )
                        }
                      >
                        View /
                      </button>
                      <button
                        disabled={claim.status !== "OPEN"}
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          navigate(
                            `${PATHS.UPDATE_CLAIM.replace(
                              ":id",
                              claim.claimId.toString()
                            )}`
                          )
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                disabled={query.page === 1}
                onClick={() =>
                  setQuery((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
              >
                Prev
              </button>
              <span>
                Page {query.page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                disabled={query.page === totalPages}
                onClick={() =>
                  setQuery((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Claims;
