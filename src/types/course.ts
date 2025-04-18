export interface Tag {
  id?: string;
  name: string;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
}

export interface Attachment {
  id?: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface Lesson {
  id: string;
  section_id : number;
  title: string;
  description?: string;
  content_type: "video" | "article" | "quiz" | "assignment" | "pdf";
  content_url?: string | File;
  duration: string;
  order: number;
  videoUrl?: string;
  pdf_url?: string;
  attachments?: Attachment[];
  quiz?: Quiz;
  assignment?: Assignment;
  preview?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string | null;
  description: string;
  slug: string | null;
  instructor_id: number;
  level: string;
  language: string;
  image_url: string | null;
  video_url: string | null;
  price: string;
  discount: string;
  published_date: string | null;
  last_updated: string | null;
  status: string;
  requirements: string | null;
  what_you_will_learn: string | null;
  target_audience: string | null;
  average_rating: string;
  total_reviews: number;
  total_students: number;
  has_certificate: boolean;
  created_at: string;
  updated_at: string;
  category_id: number | null;
  categories: Category[];
  tags: Tag[];
  instructor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    email_verified_at: string | null;
    lastLogin: string | null;
    isActive: boolean;
    role: string;
    created_at: string;
    updated_at: string;
    is_approved: boolean;
  };
  sections: {
    id: number;
    course_id: number;
    title: string;
    description: string;
    order: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    lessons: Lesson[];
  }[];
}

export interface tag {
  name: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  passing_score: number;
  time_limit?: number; // en minutes
}

export interface Question {
  id: string;
  text: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  options?: string[];
  correct_answer: string;
  points: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  due_date?: string;
  points: number;
  submission_type: "text" | "file" | "both";
  allowed_file_types?: string[];
  max_file_size?: number; // en MB
}
