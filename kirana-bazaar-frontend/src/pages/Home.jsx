import Container from "../components/Container";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <section className="bg-white border-b">
        <Container>
          <div className="py-12 text-center">
            <h1 className="text-3xl font-semibold text-gray-900">
              Groceries delivered in minutes
            </h1>

            <p className="mt-3 text-gray-600">
              Fresh fruits, vegetables and daily essentials
            </p>

            <div className="mt-6 max-w-md mx-auto">
              <input
                placeholder="Search for products"
                className="w-full px-5 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </Container>
      </section>

       {/* Categories */}
      <section className="py-6">
        <Container>
          <div className="flex gap-3 flex-wrap">
            {["Vegetables", "Fruits", "Dairy", "Snacks", "Beverages"].map(
              (cat) => (
                <div
                  key={cat}
                  className="px-5 py-2 bg-white border rounded-full text-sm font-medium hover:bg-green-50 cursor-pointer"
                >
                  {cat}
                </div>
              )
            )}
          </div>
        </Container>
      </section>
      {/* Products */}
      <section className="pb-16">
        <Container>
          <h2 className="text-lg font-semibold mb-5">
            Popular Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCard key={i} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}