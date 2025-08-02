// mockData.js
export const categories = [
  { 
    id: 1, 
    name: 'Web Development', 
    icon: '💻',
    subcategories: [
      { id: 1, name: 'Frontend Development', icon: '🎨', description: 'HTML, CSS, JavaScript, React, Vue, Angular', skillCount: 45, level: 'All Levels' },
      { id: 2, name: 'Backend Development', icon: '⚙️', description: 'Node.js, Python, PHP, Java, .NET', skillCount: 38, level: 'Intermediate+' },
      { id: 3, name: 'Full Stack Development', icon: '🔄', description: 'Complete web application development', skillCount: 52, level: 'Advanced' },
      { id: 4, name: 'Database Design', icon: '🗄️', description: 'SQL, NoSQL, MongoDB, PostgreSQL', skillCount: 28, level: 'Intermediate' },
      { id: 5, name: 'DevOps & Deployment', icon: '🚀', description: 'Docker, AWS, CI/CD, Server Management', skillCount: 31, level: 'Advanced' },
      { id: 6, name: 'Web Security', icon: '🔒', description: 'Authentication, Authorization, OWASP', skillCount: 22, level: 'Intermediate+' }
    ]
  },
  { 
    id: 2, 
    name: 'Mobile Development', 
    icon: '📱',
    subcategories: [
      { id: 7, name: 'iOS Development', icon: '🍎', description: 'Swift, SwiftUI, Xcode, App Store', skillCount: 34, level: 'Intermediate+' },
      { id: 8, name: 'Android Development', icon: '🤖', description: 'Kotlin, Java, Android Studio, Google Play', skillCount: 41, level: 'Intermediate+' },
      { id: 9, name: 'React Native', icon: '⚛️', description: 'Cross-platform mobile development', skillCount: 29, level: 'Intermediate' },
      { id: 10, name: 'Flutter Development', icon: '🦋', description: 'Dart, Cross-platform, Material Design', skillCount: 26, level: 'Intermediate' },
      { id: 11, name: 'Mobile UI/UX', icon: '📱', description: 'Mobile design patterns, User experience', skillCount: 19, level: 'All Levels' },
      { id: 12, name: 'Mobile Testing', icon: '🧪', description: 'Unit testing, UI testing, Performance', skillCount: 15, level: 'Intermediate' }
    ]
  },
  { 
    id: 3, 
    name: 'Data Science', 
    icon: '📊',
    subcategories: [
      { id: 13, name: 'Machine Learning', icon: '🤖', description: 'Python, TensorFlow, Scikit-learn, Neural Networks', skillCount: 47, level: 'Advanced' },
      { id: 14, name: 'Data Analysis', icon: '📈', description: 'Python, Pandas, NumPy, Data Visualization', skillCount: 39, level: 'Intermediate' },
      { id: 15, name: 'Big Data', icon: '☁️', description: 'Hadoop, Spark, Kafka, Data Engineering', skillCount: 25, level: 'Advanced' },
      { id: 16, name: 'Statistical Analysis', icon: '📉', description: 'R, Statistics, Hypothesis Testing', skillCount: 31, level: 'Intermediate' },
      { id: 17, name: 'Data Visualization', icon: '🎨', description: 'Tableau, Power BI, D3.js, Matplotlib', skillCount: 28, level: 'All Levels' },
      { id: 18, name: 'Deep Learning', icon: '🧠', description: 'Neural Networks, CNN, RNN, Transformers', skillCount: 33, level: 'Advanced' }
    ]
  },
  { 
    id: 4, 
    name: 'Design', 
    icon: '🎨',
    subcategories: [
      { id: 19, name: 'UI/UX Design', icon: '🎯', description: 'User Interface, User Experience, Wireframing', skillCount: 42, level: 'All Levels' },
      { id: 20, name: 'Graphic Design', icon: '🖼️', description: 'Adobe Creative Suite, Typography, Branding', skillCount: 38, level: 'All Levels' },
      { id: 21, name: 'Web Design', icon: '🌐', description: 'Responsive Design, CSS, Design Systems', skillCount: 35, level: 'Intermediate' },
      { id: 22, name: 'Logo Design', icon: '🏷️', description: 'Brand Identity, Vector Graphics, Illustrator', skillCount: 24, level: 'All Levels' },
      { id: 23, name: '3D Design', icon: '🎪', description: 'Blender, Maya, 3D Modeling, Animation', skillCount: 18, level: 'Intermediate' },
      { id: 24, name: 'Print Design', icon: '📄', description: 'Layout Design, Typography, Print Production', skillCount: 16, level: 'Intermediate' }
    ]
  },
  { 
    id: 5, 
    name: 'Marketing', 
    icon: '📢',
    subcategories: [
      { id: 25, name: 'Digital Marketing', icon: '💻', description: 'SEO, SEM, Social Media, Content Marketing', skillCount: 44, level: 'All Levels' },
      { id: 26, name: 'Social Media Marketing', icon: '📱', description: 'Platform Strategy, Content Creation, Analytics', skillCount: 37, level: 'All Levels' },
      { id: 27, name: 'Email Marketing', icon: '📧', description: 'Campaign Strategy, Automation, Analytics', skillCount: 29, level: 'Intermediate' },
      { id: 28, name: 'Content Marketing', icon: '📝', description: 'Blog Writing, Video Content, Storytelling', skillCount: 32, level: 'All Levels' },
      { id: 29, name: 'SEO Optimization', icon: '🔍', description: 'Search Engine Optimization, Keyword Research', skillCount: 26, level: 'Intermediate' },
      { id: 30, name: 'Marketing Analytics', icon: '📊', description: 'Google Analytics, Data Analysis, Reporting', skillCount: 23, level: 'Intermediate' }
    ]
  },
  { 
    id: 6, 
    name: 'Business', 
    icon: '💼',
    subcategories: [
      { id: 31, name: 'Entrepreneurship', icon: '🚀', description: 'Business Planning, Startup Strategy, Funding', skillCount: 41, level: 'All Levels' },
      { id: 32, name: 'Project Management', icon: '📋', description: 'Agile, Scrum, Jira, Team Leadership', skillCount: 35, level: 'Intermediate' },
      { id: 33, name: 'Business Strategy', icon: '🎯', description: 'Strategic Planning, Market Analysis, Growth', skillCount: 28, level: 'Advanced' },
      { id: 34, name: 'Financial Management', icon: '💰', description: 'Budgeting, Financial Planning, Analysis', skillCount: 31, level: 'Intermediate' },
      { id: 35, name: 'Sales & Business Development', icon: '🤝', description: 'Sales Strategy, Client Relations, Networking', skillCount: 33, level: 'All Levels' },
      { id: 36, name: 'Operations Management', icon: '⚙️', description: 'Process Optimization, Supply Chain, Efficiency', skillCount: 22, level: 'Intermediate' }
    ]
  },
  { 
    id: 7, 
    name: 'Photography', 
    icon: '📸',
    subcategories: [
      { id: 37, name: 'Portrait Photography', icon: '👤', description: 'People Photography, Lighting, Posing', skillCount: 28, level: 'All Levels' },
      { id: 38, name: 'Landscape Photography', icon: '🏔️', description: 'Nature Photography, Composition, Light', skillCount: 24, level: 'All Levels' },
      { id: 39, name: 'Street Photography', icon: '🏙️', description: 'Urban Photography, Candid Shots, Storytelling', skillCount: 19, level: 'Intermediate' },
      { id: 40, name: 'Product Photography', icon: '📦', description: 'Commercial Photography, Lighting, Editing', skillCount: 21, level: 'Intermediate' },
      { id: 41, name: 'Photo Editing', icon: '🎨', description: 'Lightroom, Photoshop, Color Correction', skillCount: 26, level: 'All Levels' },
      { id: 42, name: 'Videography', icon: '🎥', description: 'Video Production, Cinematography, Editing', skillCount: 18, level: 'Intermediate' }
    ]
  },
  { 
    id: 8, 
    name: 'Writing', 
    icon: '✍️',
    subcategories: [
      { id: 43, name: 'Content Writing', icon: '📝', description: 'Blog Writing, SEO Content, Copywriting', skillCount: 36, level: 'All Levels' },
      { id: 44, name: 'Creative Writing', icon: '✏️', description: 'Fiction, Poetry, Storytelling, Creative Process', skillCount: 29, level: 'All Levels' },
      { id: 45, name: 'Technical Writing', icon: '📚', description: 'Documentation, Manuals, Technical Communication', skillCount: 23, level: 'Intermediate' },
      { id: 46, name: 'Copywriting', icon: '💼', description: 'Advertising Copy, Marketing Materials, Persuasion', skillCount: 31, level: 'Intermediate' },
      { id: 47, name: 'Academic Writing', icon: '🎓', description: 'Research Papers, Essays, Academic Style', skillCount: 25, level: 'Advanced' },
      { id: 48, name: 'Script Writing', icon: '🎬', description: 'Screenplays, Video Scripts, Dialogue', skillCount: 18, level: 'Intermediate' }
    ]
  },
  { 
    id: 9, 
    name: 'Music', 
    icon: '🎵',
    subcategories: [
      { id: 49, name: 'Music Production', icon: '🎹', description: 'DAW, Mixing, Mastering, Sound Design', skillCount: 32, level: 'All Levels' },
      { id: 50, name: 'Instrument Lessons', icon: '🎸', description: 'Guitar, Piano, Drums, Various Instruments', skillCount: 41, level: 'All Levels' },
      { id: 51, name: 'Music Theory', icon: '🎼', description: 'Harmony, Rhythm, Composition, Analysis', skillCount: 28, level: 'Intermediate' },
      { id: 52, name: 'Vocal Training', icon: '🎤', description: 'Singing Techniques, Voice Control, Performance', skillCount: 24, level: 'All Levels' },
      { id: 53, name: 'Music Technology', icon: '🎛️', description: 'Audio Engineering, Recording, Software', skillCount: 19, level: 'Intermediate' },
      { id: 54, name: 'Songwriting', icon: '✍️', description: 'Lyrics, Melody, Chord Progressions, Structure', skillCount: 26, level: 'All Levels' }
    ]
  },
  { 
    id: 10, 
    name: 'Languages', 
    icon: '🗣️',
    subcategories: [
      { id: 55, name: 'English', icon: '🇺🇸', description: 'Conversation, Grammar, Business English', skillCount: 38, level: 'All Levels' },
      { id: 56, name: 'Spanish', icon: '🇪🇸', description: 'Conversation, Grammar, Cultural Context', skillCount: 29, level: 'All Levels' },
      { id: 57, name: 'French', icon: '🇫🇷', description: 'Conversation, Grammar, Pronunciation', skillCount: 24, level: 'All Levels' },
      { id: 58, name: 'German', icon: '🇩🇪', description: 'Grammar, Conversation, Business German', skillCount: 21, level: 'All Levels' },
      { id: 59, name: 'Chinese', icon: '🇨🇳', description: 'Mandarin, Characters, Tones, Culture', skillCount: 18, level: 'All Levels' },
      { id: 60, name: 'Japanese', icon: '🇯🇵', description: 'Hiragana, Katakana, Kanji, Culture', skillCount: 16, level: 'All Levels' }
    ]
  }
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

export const mockReviews = [
  {
    id: '1',
    userId: 'user1',
    reviewerName: 'Jane Doe',
    comment: 'Great skill exchange! Very professional and helpful.',
    date: '2024-07-01'
  },
  {
    id: '2',
    userId: 'user1',
    reviewerName: 'John Smith',
    comment: 'Very knowledgeable and friendly. Highly recommend!',
    date: '2024-06-28'
  },
  {
    id: '3',
    userId: 'user2',
    reviewerName: 'Alice Brown',
    comment: 'Excellent communication and skills.',
    date: '2024-06-20'
  }
];