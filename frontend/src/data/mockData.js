export const mockUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    location: "San Francisco, CA",
    rating: 4.8,
    skillsOffered: ["Web Development", "React", "Node.js"],
    skillsWanted: ["UI/UX Design", "Mobile Development"],
    joinedDate: "2024-01-15",
    verified: true
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    location: "New York, NY",
    rating: 4.9,
    skillsOffered: ["UI/UX Design", "Figma", "Prototyping"],
    skillsWanted: ["Data Science", "Python"],
    joinedDate: "2024-02-20",
    verified: true
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    location: "Austin, TX",
    rating: 4.7,
    skillsOffered: ["Digital Marketing", "SEO", "Social Media"],
    skillsWanted: ["Web Development", "E-commerce"],
    joinedDate: "2024-01-30",
    verified: false
  }
];

export const mockSkills = [
  {
    id: 1,
    title: "Learn React & Redux from Scratch",
    description: "I'll teach you modern React development including hooks, context, and Redux state management. Perfect for beginners to intermediate developers.",
    category: "Web Development",
    subcategory: "Frontend",
    userId: 1,
    user: mockUsers[0],
    timeCommitment: "4-6 hours",
    skillLevel: "Beginner to Intermediate",
    tags: ["React", "Redux", "JavaScript", "Frontend"],
    images: [
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    createdAt: "2024-11-01",
    isOffering: true,
    wantedSkills: ["UI/UX Design", "Mobile Development"],
    rating: 4.8,
    reviews: 12
  },
  {
    id: 2,
    title: "Professional UI/UX Design Mentorship",
    description: "Get hands-on experience with design thinking, user research, and creating beautiful interfaces using Figma and Adobe Creative Suite.",
    category: "Design",
    subcategory: "UI/UX",
    userId: 2,
    user: mockUsers[1],
    timeCommitment: "3-4 hours",
    skillLevel: "All Levels",
    tags: ["UI Design", "UX Research", "Figma", "Prototyping"],
    images: [
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    createdAt: "2024-10-28",
    isOffering: true,
    wantedSkills: ["Data Science", "Python Programming"],
    rating: 4.9,
    reviews: 24
  },
  {
    id: 3,
    title: "Digital Marketing Strategy & SEO",
    description: "Learn how to create effective marketing campaigns, optimize for search engines, and grow your online presence organically.",
    category: "Marketing",
    subcategory: "Digital Marketing",
    userId: 3,
    user: mockUsers[2],
    timeCommitment: "2-3 hours",
    skillLevel: "Beginner",
    tags: ["SEO", "Marketing", "Analytics", "Social Media"],
    images: [
      "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    createdAt: "2024-10-25",
    isOffering: true,
    wantedSkills: ["Web Development", "E-commerce"],
    rating: 4.7,
    reviews: 8
  },
  {
    id: 4,
    title: "Looking for: Advanced Python & Data Science",
    description: "Seeking an experienced data scientist to help me learn advanced Python, machine learning algorithms, and data visualization techniques.",
    category: "Data Science",
    subcategory: "Machine Learning",
    userId: 2,
    user: mockUsers[1],
    timeCommitment: "5-6 hours",
    skillLevel: "Advanced",
    tags: ["Python", "Machine Learning", "Data Analysis", "Pandas"],
    images: [
      "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    createdAt: "2024-10-30",
    isOffering: false,
    offeredSkills: ["UI/UX Design", "Figma", "Prototyping"],
    rating: null,
    reviews: 0
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    description: "Comprehensive mobile development course covering React Native, navigation, state management, and publishing to app stores.",
    category: "Mobile Development",
    subcategory: "Cross-platform",
    userId: 1,
    user: mockUsers[0],
    timeCommitment: "6-8 hours",
    skillLevel: "Intermediate",
    tags: ["React Native", "Mobile", "iOS", "Android"],
    images: [
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    createdAt: "2024-10-20",
    isOffering: true,
    wantedSkills: ["Backend Development", "Database Design"],
    rating: 4.6,
    reviews: 15
  }
];

export const categories = [
  {
    id: 1,
    name: "Web Development",
    icon: "💻",
    subcategories: ["Frontend", "Backend", "Full Stack", "DevOps"]
  },
  {
    id: 2,
    name: "Design",
    icon: "🎨",
    subcategories: ["UI/UX", "Graphic Design", "Web Design", "Branding"]
  },
  {
    id: 3,
    name: "Marketing",
    icon: "📈",
    subcategories: ["Digital Marketing", "SEO", "Social Media", "Content Marketing"]
  },
  {
    id: 4,
    name: "Data Science",
    icon: "📊",
    subcategories: ["Machine Learning", "Data Analysis", "Statistics", "Big Data"]
  },
  {
    id: 5,
    name: "Mobile Development",
    icon: "📱",
    subcategories: ["iOS", "Android", "Cross-platform", "React Native"]
  },
  {
    id: 6,
    name: "Business",
    icon: "💼",
    subcategories: ["Strategy", "Finance", "Operations", "Consulting"]
  }
];