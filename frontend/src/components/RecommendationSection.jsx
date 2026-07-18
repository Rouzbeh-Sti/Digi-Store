import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function RecommendationSection({ title, subtitle, products, icon = '✨' }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 mb-16">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>{icon}</span> {title}
          </h2>
          {subtitle && <p className="text-xs font-bold text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <Link to="/marketplace" className="text-xs font-black text-[#6d28d9] hover:underline bg-purple-50 px-3 py-1.5 rounded-xl">
          مشاهده همه ←
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} item={product} />
        ))}
      </div>
    </section>
  );
}