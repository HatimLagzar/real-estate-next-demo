import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getProperty, updateProperty } from "@/lib/api";
import PropertyForm from "@/components/PropertyForm";

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getProperty(id)
      .then((data) => {
        if (!cancelled) {
          setInitialData({
            property_type: data.property_type ?? "",
            features: Array.isArray(data.features) ? data.features.join(", ") : (data.features ?? ""),
            price: data.price ?? "",
            taxes: data.taxes ?? "",
            income: data.income ?? "",
            expenditure: data.expenditure ?? "",
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || "Failed to load property");
      });
    return () => { cancelled = true; };
  }, [id]);

  async function handleSubmit(payload, setFieldErrors) {
    setError("");
    setLoading(true);
    try {
      await updateProperty(id, payload);
      router.push("/properties");
    } catch (err) {
      setError(err.message || "Failed to update property");
      if (err.errors) setFieldErrors(err.errors);
    } finally {
      setLoading(false);
    }
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/properties" className="text-sm text-zinc-500 dark:text-zinc-400 hover:underline mb-4 inline-block">
            ← Back to properties
          </Link>
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-700 dark:text-red-300">
            {loadError}
          </div>
        </div>
      </div>
    );
  }

  if (initialData == null) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8">
        <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
          <p className="text-zinc-500 dark:text-zinc-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/properties"
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-4 inline-block"
        >
          ← Back to properties
        </Link>
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
            Edit property
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Update listing details
          </p>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          <PropertyForm
            initialData={initialData}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Save changes"
          />
        </div>
      </div>
    </div>
  );
}
