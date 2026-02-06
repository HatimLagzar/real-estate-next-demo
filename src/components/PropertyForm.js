import { useState } from "react";

const PROPERTY_TYPES = [
  { value: "", label: "Select type" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
];

const defaultValues = {
  property_type: "",
  features: "",
  price: "",
  taxes: "",
  income: "",
  expenditure: "",
};

// features: stored as comma-separated string in form; API expects array of strings
function parseFeatures(str) {
  if (!str || typeof str !== "string") return [];
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatFeatures(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join(", ");
}

export default function PropertyForm({ initialData = {}, onSubmit, loading, submitLabel = "Save" }) {
  const [form, setForm] = useState({
    ...defaultValues,
    ...initialData,
    features: typeof initialData.features === "string" ? initialData.features : formatFeatures(initialData.features),
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: null }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    const payload = {
      property_type: form.property_type || null,
      features: parseFeatures(form.features),
      price: form.price === "" ? null : Number(form.price),
      taxes: form.taxes === "" ? null : Number(form.taxes),
      income: form.income === "" ? null : Number(form.income),
      expenditure: form.expenditure === "" ? null : Number(form.expenditure),
    };
    onSubmit(payload, setFieldErrors);
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";
  const errorClass = "mt-1 text-sm text-red-600 dark:text-red-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="property_type" className={labelClass}>
          Property type
        </label>
        <select
          id="property_type"
          value={form.property_type}
          onChange={(e) => update("property_type", e.target.value)}
          className={inputClass}
        >
          {PROPERTY_TYPES.map((opt) => (
            <option key={opt.value || "empty"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {fieldErrors.property_type && (
          <p className={errorClass}>{fieldErrors.property_type[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="features" className={labelClass}>
          Features
        </label>
        <input
          id="features"
          type="text"
          value={form.features}
          onChange={(e) => update("features", e.target.value)}
          className={inputClass}
          placeholder="e.g. pool, garage, garden"
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Comma-separated list
        </p>
        {fieldErrors.features && (
          <p className={errorClass}>{fieldErrors.features[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <label htmlFor="price" className={labelClass}>
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className={inputClass}
            placeholder="0"
          />
          {fieldErrors.price && (
            <p className={errorClass}>{fieldErrors.price[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="taxes" className={labelClass}>
            Taxes
          </label>
          <input
            id="taxes"
            type="number"
            min="0"
            step="0.01"
            value={form.taxes}
            onChange={(e) => update("taxes", e.target.value)}
            className={inputClass}
            placeholder="0"
          />
          {fieldErrors.taxes && (
            <p className={errorClass}>{fieldErrors.taxes[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="income" className={labelClass}>
            Income
          </label>
          <input
            id="income"
            type="number"
            min="0"
            step="0.01"
            value={form.income}
            onChange={(e) => update("income", e.target.value)}
            className={inputClass}
            placeholder="0"
          />
          {fieldErrors.income && (
            <p className={errorClass}>{fieldErrors.income[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="expenditure" className={labelClass}>
            Expenditure
          </label>
          <input
            id="expenditure"
            type="number"
            min="0"
            step="0.01"
            value={form.expenditure}
            onChange={(e) => update("expenditure", e.target.value)}
            className={inputClass}
            placeholder="0"
          />
          {fieldErrors.expenditure && (
            <p className={errorClass}>{fieldErrors.expenditure[0]}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-2.5 px-4 hover:bg-zinc-800 dark:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
