export default function ProductCard() {
  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-sm transition">

      <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>

      <h3 className="text-sm font-medium text-gray-800 leading-snug">
        Fresh Tomatoes
      </h3>

      <p className="text-xs text-gray-500 mt-1">1 kg</p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold">₹40</span>
        <button className="px-3 py-1 text-xs bg-green-600 text-white rounded-md">
          Add
        </button>
      </div>
    </div>
  );
}