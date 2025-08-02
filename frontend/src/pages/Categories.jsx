import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { categories } from '../data/mockData';

const Categories = () => {
  const { categoryName } = useParams();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Find the category based on the URL parameter
    const category = categories.find(cat => 
      cat.name.toLowerCase().replace(' ', '-') === categoryName
    );
    setCurrentCategory(category);
  }, [categoryName]);

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredSubcategories = currentCategory.subcategories?.filter(subcat =>
    subcat.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-4xl">{currentCategory.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {currentCategory.name}
              </h1>
              <p className="text-lg text-gray-600">
                Explore {currentCategory.subcategories?.length || 0} subcategories in {currentCategory.name}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Subcategories Grid */}
        {filteredSubcategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/explore?category=${encodeURIComponent(subcategory.name)}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{subcategory.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {subcategory.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {subcategory.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {subcategory.skillCount || 0} skills available
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {subcategory.level || 'All Levels'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No subcategories found' : 'No subcategories available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No subcategories match "${searchTerm}"`
                : 'This category doesn\'t have any subcategories yet.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories; 