export interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  image: string;
  lastViewed: string;
  rating: number;
  reviews: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  level: string;
  description: string;
  bookmarked: boolean;
  isArchived: boolean;
  estimatedTimeLeft: string;
  lastSection: string;
  lastLesson: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  course: string;
  skills: string[];
}

export interface Notification {
  id: number;
  title: string;
  course: string;
  time: string;
  icon: string;
  read: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  activeStudents: number;
  completionRate: number;
  averageRating: number;
}

export interface RecentActivity {
  id: number;
  type: 'enrollment' | 'completion' | 'review';
  studentName: string;
  courseName: string;
  timestamp: string;
  details?: string;
}

export interface PopularCourse {
  id: number;
  title: string;
  enrollments: number;
  revenue: number;
  rating: number;
  imageUrl: string;
}

export interface DashboardData {
  stats: DashboardStats;
  courses: Course[];
  certificates: Certificate[];
  notifications: Notification[];
  categories: Array<{
    id: string;
    name: string;
  }>;
  recentActivities: RecentActivity[];
  popularCourses: PopularCourse[];
  revenueChart: {
    labels: string[];
    data: number[];
  };
  enrollmentChart: {
    labels: string[];
    data: number[];
  };
} 