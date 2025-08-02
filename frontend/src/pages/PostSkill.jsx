import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, X, Plus, Save, BookOpen, Users, Clock, Target } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const PostSkill = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    location: '',
    tags: '',
    isOffering: true,
    availability: 'flexible',
    requirements: '',
    // New fields for skill seeking
    currentLevel: 'beginner',
    learningGoals: '',
    preferredStyle: 'one-on-one',
    timeCommitment: 'flexible',
    budget: 'free',
    mentorRequirements: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (uploadedImages.length + acceptedFiles.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/upload/skill-images`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadedImages(prev => [...prev, ...data.images]);
        toast.success('Images uploaded successfully');
      } else {
        toast.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let skillData;

      if (formData.isOffering) {
        // For offering skills
        skillData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          level: formData.level,
          location: formData.location,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          mediaUrls: uploadedImages.map(img => img.url),
          isOffering: true,
          availability: formData.availability,
          requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req)
        };
      } else {
        // For seeking skills
        skillData = {
          title: formData.title,
          description: formData.learningGoals, // Use learningGoals as description
          category: formData.category,
          level: 'beginner', // Default level for seeking
          location: formData.location,
          tags: [], // No tags for seeking
          mediaUrls: [], // No images for seeking
          isOffering: false,
          availability: 'flexible', // Default availability for seeking
          requirements: [], // No requirements for seeking
          // Skill seeking specific fields
          currentLevel: formData.currentLevel,
          learningGoals: formData.learningGoals,
          preferredStyle: formData.preferredStyle,
          timeCommitment: formData.timeCommitment,
          budget: formData.budget,
          mentorRequirements: formData.mentorRequirements
        };
      }

      console.log('Submitting skill data:', skillData); // Debug log

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/skills`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(skillData)
        }
      );

      if (response.ok) {
        toast.success(formData.isOffering ? 'Skill posted successfully!' : 'Skill request posted successfully!');
        navigate('/dashboard');
      } else {
        const error = await response.json();
        console.error('Server error:', error); // Debug log
        toast.error(error.error || 'Failed to post skill');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to post skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Web Development',
    'Mobile Development', 
    'Data Science',
    'Design',
    'Marketing',
    'Business',
    'Photography',
    'Writing',
    'Music',
    'Languages',
    'Other'
  ];

  const learningStyles = [
    { value: 'one-on-one', label: 'One-on-One Sessions' },
    { value: 'group', label: 'Group Classes' },
    { value: 'project-based', label: 'Project-Based Learning' },
    { value: 'mentorship', label: 'Mentorship Program' },
    { value: 'flexible', label: 'Flexible (Any Style)' }
  ];

  const timeCommitments = [
    { value: 'flexible', label: 'Flexible Schedule' },
    { value: '1-2-hours', label: '1-2 hours per week' },
    { value: '3-5-hours', label: '3-5 hours per week' },
    { value: '5-10-hours', label: '5-10 hours per week' },
    { value: 'intensive', label: 'Intensive (10+ hours/week)' }
  ];

  const budgetOptions = [
    { value: 'free', label: 'Free (Skill Exchange)' },
    { value: 'low', label: 'Low Cost ($1-20/hour)' },
    { value: 'medium', label: 'Medium Cost ($20-50/hour)' },
    { value: 'high', label: 'High Cost ($50+/hour)' },
    { value: 'negotiable', label: 'Negotiable' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {formData.isOffering ? 'Offer a Skill' : 'Request a Skill'}
            </h1>
            <p className="text-gray-600 mt-1">
              {formData.isOffering 
                ? 'Share your expertise with the community'
                : 'Find someone to help you learn and grow'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill Type Toggle */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isOffering: true }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.isOffering
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                I'm Offering
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isOffering: false }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !formData.isOffering
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                I'm Seeking
              </button>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.isOffering ? 'Skill Title *' : 'Skill You Want to Learn *'}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder={formData.isOffering ? "e.g., React.js Development" : "e.g., TypeScript Programming"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Different fields based on offering vs seeking */}
            {formData.isOffering ? (
              // OFFERING SKILL FIELDS
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skill Level *
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="City, State or Remote"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Describe your skill, experience, and what you can offer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="react, javascript, web development (comma separated)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="flexible">Flexible</option>
                      <option value="weekdays">Weekdays Only</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="evenings">Evenings Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <input
                      type="text"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="laptop, internet connection (comma separated)"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (Optional)
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag & drop images here, or click to select files'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Maximum 3 images, 5MB each</p>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // SEEKING SKILL FIELDS
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Current Level *
                    </label>
                    <select
                      name="currentLevel"
                      value={formData.currentLevel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="beginner">Complete Beginner</option>
                      <option value="some-experience">Some Experience</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced (Looking to Master)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Learning Style *
                    </label>
                    <select
                      name="preferredStyle"
                      value={formData.preferredStyle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {learningStyles.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What do you want to learn? *
                  </label>
                  <textarea
                    name="learningGoals"
                    value={formData.learningGoals}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Describe what you want to learn, your goals, and any specific topics you're interested in..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Commitment *
                    </label>
                    <select
                      name="timeCommitment"
                      value={formData.timeCommitment}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {timeCommitments.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Preference *
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {budgetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are you looking for in a mentor/teacher?
                  </label>
                  <textarea
                    name="mentorRequirements"
                    value={formData.mentorRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Patient teacher, industry experience, project-based learning, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Preference
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="City, State, Remote, or Any"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Posting...' : (formData.isOffering ? 'Post Skill' : 'Request Skill')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostSkill; 