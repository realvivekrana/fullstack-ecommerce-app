import clsx from 'clsx';
import { categories } from '@/data/categories';

/* ── Section wrapper ───────────────────────────────────────────────────── */
function FilterSection({ title, children }) {
  return (
    <div className="pb-6 mb-6 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
      <h3 className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ── Radio / Checkbox row ──────────────────────────────────────────────── */
function FilterRow({ checked, onChange, label, type = 'radio' }) {
  return (
    <label
      className={clsx(
        'flex items-center gap-3 py-1.5 px-2 rounded-lg cursor-pointer',
        'text-[13px] transition-colors duration-150 select-none',
        checked
          ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/6 font-semibold'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      )}
    >
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="accent-[var(--color-primary)] w-3.5 h-3.5 shrink-0"
      />
      {label}
    </label>
  );
}

function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  inStockOnly,
  onStockChange,
}) {
  return (
    <aside aria-label="Product filters" className="space-y-0">

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-0.5">
          <FilterRow
            type="radio"
            checked={!selectedCategory}
            onChange={() => onCategoryChange('')}
            label="All Categories"
          />
          {categories.map((cat) => (
            <FilterRow
              key={cat.id}
              type="radio"
              checked={selectedCategory === cat.id}
              onChange={() => onCategoryChange(cat.id)}
              label={cat.name}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price range */}
      <FilterSection title="Price Range">
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            aria-label={`Maximum price: ₹${priceRange.toLocaleString('en-IN')}`}
            className="w-full"
          />
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[12px] text-gray-400">₹0</span>
            <span className="text-[13px] font-semibold text-gray-900">
              Up to ₹{priceRange.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* In stock */}
      <FilterSection title="Availability">
        <FilterRow
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onStockChange(e.target.checked)}
          label="In stock only"
        />
      </FilterSection>
    </aside>
  );
}

export default FilterSidebar;
