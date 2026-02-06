import { useState, useEffect } from "react";
import Link from "next/link";
import { getProperties, deleteProperty } from "@/lib/api";

function formatMoney(val) {
  if (val == null || val === "") return "—";
  const n = Number(val);
  if (Number.isNaN(n)) return "—";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatFeatures(features) {
  if (!features) return "—";
  if (Array.isArray(features)) return features.length ? features.join(", ") : "—";
  if (typeof features === "string") return features || "—";
  return "—";
}

export default function PropertiesListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getProperties()
      .then((list) => {
        if (!cancelled) setProperties(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load properties");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this property?")) return;
    setDeletingId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
          <p className="text-zinc-500 dark:text-zinc-400">Loading properties…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Properties
          </h1>
          <Link
            href="/properties/new"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-2.5 px-4 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            Add property
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              No properties yet.
            </p>
            <Link
              href="/properties/new"
              className="text-zinc-900 dark:text-white font-medium hover:underline"
            >
              Create your first property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Type
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Features
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Price
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Taxes
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Income
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Expenditure
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-zinc-100 dark:border-zinc-700/50 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/properties/${p.id}/edit`}
                        className="font-medium text-zinc-900 dark:text-white hover:underline capitalize"
                      >
                        {p.property_type || "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate">
                      {formatFeatures(p.features)}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums">
                      {formatMoney(p.price)}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums">
                      {formatMoney(p.taxes)}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums">
                      {formatMoney(p.income)}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums">
                      {formatMoney(p.expenditure)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/properties/${p.id}/edit`}
                          className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                        >
                          {deletingId === p.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
