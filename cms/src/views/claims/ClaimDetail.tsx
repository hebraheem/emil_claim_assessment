import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClaim, fetchConfig } from "../../services";
import { ClaimDto } from "../../types";
import { PATHS } from "../../routes/paths";
import {
  CONFIG_STORAGE_KEY,
  formatDate,
  formatLabel,
  statusBadgeClass,
} from "../../utils";

const ClaimDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<ClaimDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [configDef, setConfigDef] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const getConfig = async () => {
      try {
        setLoading(true);
        let configStr = localStorage.getItem(CONFIG_STORAGE_KEY);
        let configObj: Record<string, any> | null = null;
        if (!configStr) {
          const fetchedConfig = await fetchConfig();
          localStorage.setItem(
            CONFIG_STORAGE_KEY,
            JSON.stringify(fetchedConfig)
          );
          configObj = fetchedConfig;
        } else {
          configObj = JSON.parse(configStr) as Record<string, any>;
        }
        const attributesConfigs: Record<string, any> = {};
        configObj?.data.forEach(
          (item: { configs: Record<string, unknown>; fixed: boolean }) => {
            Object.keys(item.configs).forEach((key) => {
              attributesConfigs[key] = item.configs[key];
            });
          }
        );
        setConfigDef(attributesConfigs);
      } catch (error: any) {
        alert("Error fetching configuration: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    getConfig();
  }, []);

  useEffect(() => {
    const getClaim = async () => {
      setLoading(true);
      try {
        const res = await fetchClaim(id as string);
        setClaim(res.claim as ClaimDto); // adapt to your API response
      } catch (error: any) {
        alert(
          error.message + " " + JSON.stringify(error.errors || {}, null, 2) ||
            "Failed to fetch claim"
        );
      } finally {
        setLoading(false);
      }
    };
    getClaim();
  }, [id]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading claim details...
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="py-10 text-center text-gray-400">Claim not found.</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-3">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-gray-600 hover:text-blue-600"
          title="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold">Claim Details</h2>
      </div>
      <div className="mb-6">
        <span className="text-gray-500">Claim ID:</span>
        <span className="ml-2 font-mono text-lg">{claim.claimId}</span>
      </div>
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <span className="text-gray-500">Incident Type:</span>
          <span className="ml-2 font-semibold">
            {formatLabel(claim.incidentType)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <span
            className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
              claim.status
            )}`}
          >
            {formatLabel(claim.status)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Created At:</span>
          <span className="ml-2">{formatDate(claim.createdAt)}</span>
        </div>
        <div>
          <span className="text-gray-500">Last Updated:</span>
          <span className="ml-2">{formatDate(claim.updatedAt)}</span>
        </div>
      </div>
      <div className="mb-6">
        <span className="text-gray-500">Description:</span>
        <div className="mt-1 bg-gray-50 rounded p-3 text-gray-700 min-h-[40px]">
          {claim.description || (
            <span className="italic text-gray-400">No description</span>
          )}
        </div>
      </div>
      {/* Render additional attributes if available */}
      {claim.attributes && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-700">
            Additional Details
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(claim.attributes).map(([key, value]) => (
                <tr key={key}>
                  <td className="py-1 pr-4 text-gray-500">
                    {configDef?.[key]?.label || formatLabel(key)}:
                  </td>
                  <td className="py-1">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex gap-2 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
          onClick={() => navigate(PATHS.CLAIMS)}
        >
          Back to List
        </button>
        <button
          disabled={claim.status !== "OPEN"}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          onClick={() =>
            navigate(
              `${PATHS.UPDATE_CLAIM.replace(":id", claim.claimId.toString())}`
            )
          }
        >
          Edit Claim
        </button>
        <button
          disabled={claim.status === "CLOSED"}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
        >
          Approve
        </button>
        <button
          disabled={claim.status !== "OPEN"}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ClaimDetail;
