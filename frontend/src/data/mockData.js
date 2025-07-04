// mockData.js
export const categories = [
  { id: 1, name: 'Web Development', icon: '💻' },
  { id: 2, name: 'Mobile Development', icon: '📱' },
  { id: 3, name: 'Data Science', icon: '📊' },
  { id: 4, name: 'Design', icon: '🎨' },
  { id: 5, name: 'Marketing', icon: '📢' },
  { id: 6, name: 'Business', icon: '💼' },
  { id: 7, name: 'Photography', icon: '📸' },
  { id: 8, name: 'Writing', icon: '✍️' },
  { id: 9, name: 'Music', icon: '🎵' },
  { id: 10, name: 'Languages', icon: '🗣️' }
];

export const mockSkills = [
  {
    id: 1,
    title: 'React.js Development',
    category: 'Web Development',
    description: 'Learn modern React development with hooks, context, and best practices.',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
    provider: {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    rating: 4.8,
    students: 1250,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    tags: ['React', 'JavaScript', 'Frontend'],
    type: 'offering',
    skillLevel: 'Intermediate',
    timeCommitment: '3-4 hours'
  },
  {
    id: 2,
    title: 'UI/UX Design Fundamentals',
    category: 'Design',
    description: 'Master the principles of user interface and user experience design.',
    difficulty: 'Beginner',
    duration: '2-3 hours',
    provider: {
      id: 2,
      name: 'Mike Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    rating: 4.6,
    students: 890,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    tags: ['UI', 'UX', 'Design', 'Figma'],
    type: 'offering',
    skillLevel: 'Beginner',
    timeCommitment: '2-3 hours'
  },
  {
    id: 3,
    title: 'Data Analysis with Python',
    category: 'Data Science',
    description: 'Learn data analysis techniques using Python, pandas, and matplotlib.',
    difficulty: 'Advanced',
    duration: '4-6 hours',
    provider: {
      id: 3,
      name: 'Emily Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    rating: 4.9,
    students: 567,
    image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    tags: ['Python', 'Data Analysis', 'Pandas', 'Matplotlib'],
    type: 'offering',
    skillLevel: 'Advanced',
    timeCommitment: '4-6 hours'
  },
  {
    id: 4,
    title: 'Digital Marketing Strategy',
    category: 'Marketing',
    description: 'Develop comprehensive digital marketing strategies for modern businesses.',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
    provider: {
      id: 4,
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    rating: 4.7,
    students: 1100,
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    tags: ['Marketing', 'Strategy', 'Digital', 'Analytics'],
    type: 'seeking',
    skillLevel: 'Intermediate',
    timeCommitment: '3-4 hours'
  },
  {
    id: 5,
    title: 'Mobile App Development',
    category: 'Mobile Development',
    description: 'Build native mobile applications using React Native and Flutter.',
    difficulty: 'Advanced',
    duration: '6+ hours',
    provider: {
      id: 5,
      name: 'Lisa Wang',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    rating: 4.8,
    students: 745,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    tags: ['React Native', 'Flutter', 'Mobile', 'iOS', 'Android'],
    type: 'offering',
    skillLevel: 'Advanced',
    timeCommitment: '6+ hours'
  },
  {
    id: 6,
    title: 'Photography Basics',
    category: 'Photography',
    description: 'Learn the fundamentals of photography including composition and lighting.',
    difficulty: 'Beginner',
    duration: '2-3 hours',
    provider: {
      id: 6,
      name: 'Alex Thompson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    rating: 4.5,
    students: 432,
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    tags: ['Photography', 'Composition', 'Lighting', 'Basics'],
    type: 'seeking',
    skillLevel: 'Beginner',
    timeCommitment: '2-3 hours'
  }
];

export const mockUsers = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    location: 'San Francisco, CA',
    verified: true,
    skillsOffered: ['React.js', 'Node.js', 'JavaScript'],
    skillsWanted: ['UI/UX Design', 'Product Management'],
    bio: 'Full-stack developer with 5 years of experience in modern web technologies.',
    rating: 4.8,
    totalSessions: 156
  },
  {
    id: 2,
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@email.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    location: 'Austin, TX',
    verified: true,
    skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
    skillsWanted: ['React.js', 'Frontend Development'],
    bio: 'Creative designer passionate about creating intuitive user experiences.',
    rating: 4.6,
    totalSessions: 89
  },
  {
    id: 3,
    name: 'Emily Johnson',
    email: 'emily.johnson@email.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    location: 'Seattle, WA',
    verified: true,
    skillsOffered: ['Data Science', 'Python', 'Machine Learning'],
    skillsWanted: ['Data Visualization', 'Business Intelligence'],
    bio: 'Data scientist helping businesses make data-driven decisions.',
    rating: 4.9,
    totalSessions: 203
  }
];