import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { createProperty } from "@/lib/api";
import PropertyForm from "@/components/PropertyForm";

export default function NewPropertyPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(payload, setFieldErrors) {
    setError("");
    setLoading(true);
    try {
      await createProperty(payload);
      router.push("/properties");
    } catch (err) {
      setError(err.message || "Failed to create property");
      if (err.errors) setFieldErrors(err.errors);
    } finally {
      setLoading(false);
    }
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
            New property
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Add a new listing
          </p>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          <PropertyForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Create property"
          />
        </div>
      </div>
    </div>
  );
}
