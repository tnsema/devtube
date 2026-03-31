type FilterBarProps = {
  categories: readonly string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

export function FilterBar({ categories, activeCategory, onSelect }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-[#072E33] text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
