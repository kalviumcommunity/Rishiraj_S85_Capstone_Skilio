import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import SearchFilters from '../components/SearchFilters';

const Explore = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    skillLevel: '',
    timeCommitment: '',
    skillType: 'all'
  });
  const [sortBy, setSortBy] = useState('newest');

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.skillLevel) queryParams.append('level', filters.skillLevel);
      if (filters.skillType !== 'all') queryParams.append('skillType', filters.skillType);
      if (sortBy) queryParams.append('sortBy', sortBy);
      
      // Use the public endpoint that doesn't require authentication
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/skills/public?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setSkills(data.skills);
      } else {
        setError(data.error || 'Failed to fetch skills');
      }
    } catch (err) {
      setError('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Explore Skills
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing skills and connect with talented individuals in our community
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-600">
              Showing {skills.length} skill{skills.length !== 1 ? 's' : ''}
              {filters.search && (
                <span> for "<span className="font-medium text-gray-900">{filters.search}</span>"</span>
              )}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading skills...
            </h3>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading skills
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchSkills}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : skills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard key={skill._id || skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No skills found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more skills.
            </p>
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                skillLevel: '',
                timeCommitment: '',
                skillType: 'all'
              })}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;