import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import SearchFilters from '../components/SearchFilters';
import { mockSkills } from '../data/mockData';

const Explore = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    skillLevel: '',
    timeCommitment: '',
    skillType: 'all'
  });
  const [sortBy, setSortBy] = useState('newest');

  const filteredSkills = useMemo(() => {
    let filtered = mockSkills.filter(skill => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          skill.title.toLowerCase().includes(searchLower) ||
          skill.description.toLowerCase().includes(searchLower) ||
          skill.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          skill.user.name.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && skill.category !== filters.category) {
        return false;
      }

      // Skill level filter
      if (filters.skillLevel && skill.skillLevel !== filters.skillLevel) {
        return false;
      }

      // Time commitment filter
      if (filters.timeCommitment && skill.timeCommitment !== filters.timeCommitment) {
        return false;
      }

      // Skill type filter
      if (filters.skillType !== 'all') {
        if (filters.skillType === 'offering' && !skill.isOffering) {
          return false;
        }
        if (filters.skillType === 'seeking' && skill.isOffering) {
          return false;
        }
      }

      return true;
    });

    // Sort skills
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviews':
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        break;
    }

    return filtered;
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
              Showing {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''}
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
        {filteredSkills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
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