import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../../hooks/useCategories";
import { useCourses } from "../../hooks/useCourses";
import { Course as CourseType } from "../../types/course";
import { useEnrollmentStore } from "../../hooks/useEnrollmentStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useWishlistStore } from "../../hooks/useWishlistStore";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  Users,
  BookOpen,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PriceRange {
  min: number;
  max: number;
}

interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  data: CourseType[];
  courses: PaginationData;
}

// Modifier l'interface Course pour correspondre à la structure de l'API
interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category_id: string;
  subcategory: string;
  level: string;
  language: string;
  price: number;
  image_url: string;
  instructor: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  total_students: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  discount: number;
}

export default function CoursesExplorer() {
  const navigate = useNavigate();
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>({
    min: 0,
    max: 200,
  });
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  // Use wishlist store instead of local state
  const { 
    wishlistedCourses, 
    toggleWishlist: toggleWishlistStore,
    fetchWishlistedCourses
  } = useWishlistStore();

  // Function to toggle wishlist status
  const toggleWishlist = (courseId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation() // Prevent triggering other click events
    }
    toggleWishlistStore(courseId);
  }

  // Fetch wishlist courses when component mounts
  useEffect(() => {
    fetchWishlistedCourses();
  }, [fetchWishlistedCourses]);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { courses, loading, error } = useCourses();
  const { isAuthenticated } = useAuthStore();
  const {
    enrolledCourses,
    isEnrolled,
    fetchEnrolledCourses,
    enrollInCourse,
    purchaseCourse,
  } = useEnrollmentStore();

  // Vérifier que courses est un tableau et extraire les données
  const coursesData = Array.isArray(courses) ? courses : [];

  // Charger les cours auxquels l'utilisateur est inscrit au chargement du composant
  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrolledCourses();
    }
  }, [isAuthenticated, fetchEnrolledCourses]);

  // Calculer la pagination
  const totalPages = Math.ceil(coursesData.length / itemsPerPage);

  // Déplacer les hooks useCallback en dehors des conditions
  const getActiveCategoryName = useCallback(() => {
    if (!selectedCategory) return "All Categories";
    const category = categories.find((c) => c.id === selectedCategory);
    return category ? category.title : "All Categories";
  }, [categories, selectedCategory]);

  const getActiveSubcategoryName = useCallback(() => {
    if (!selectedSubcategory) return "All Subcategories";
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category || !category.subcategories) return "All Subcategories";
    const subcategory = category.subcategories.find(
      (s) => s.id === selectedSubcategory
    );
    return subcategory ? subcategory.title : "All Subcategories";
  }, [categories, selectedCategory, selectedSubcategory]);

  const getSubcategories = useCallback(() => {
    if (!selectedCategory) return [];
    const category = categories.find((c) => c.id === selectedCategory);
    return category && category.subcategories ? category.subcategories : [];
  }, [categories, selectedCategory]);

  if (categoriesLoading || loading) {
    return <div>Chargement des données...</div>;
  }

  if (categoriesError) {
    return <div>Erreur: {categoriesError}</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }
  console.log(coursesData);
  // Filter courses based on search, category, and other filters
  const filteredCourses = coursesData
    .filter((course: CourseType) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);
      const matchesCategory =
        !selectedCategory || course.category_id === selectedCategory;
      const matchesSubcategory =
        !selectedSubcategory || course.subcategory === selectedSubcategory;
      const matchesLevel =
        !selectedLevels.length ||
        (course.level && selectedLevels.includes(course.level));
      const matchesLanguage =
        !selectedLanguages.length ||
        (course.language && selectedLanguages.includes(course.language));
      const matchesRating =
        !selectedRating || (course.average_rating ?? 0) >= selectedRating;
      const matchesPrice =
        !selectedPrice ||
        (course.price >= selectedPrice.min &&
          course.price <= selectedPrice.max);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesLevel &&
        matchesLanguage &&
        matchesRating &&
        matchesPrice
      );
    })
    .sort((a: CourseType, b: CourseType) => {
      const aPrice = Number(a.price) || 0;
      const bPrice = Number(b.price) || 0;
      const aDiscountedPrice =
        Number(a.discount) > 0
          ? aPrice * (1 - Number(a.discount) / 100)
          : aPrice;
      const bDiscountedPrice =
        Number(b.discount) > 0
          ? bPrice * (1 - Number(b.discount) / 100)
          : bPrice;

      switch (sortOption) {
        case "popular":
          return (b.total_students ?? 0) - (a.total_students ?? 0);
        case "highest-rated":
          return (b.average_rating ?? 0) - (a.average_rating ?? 0);
        case "newest":
          return (
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime()
          );
        case "price-low":
          return aDiscountedPrice - bDiscountedPrice;
        case "price-high":
          return bDiscountedPrice - aDiscountedPrice;
        default:
          return 0;
      }
    });

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
    }
    setShowCategoryDropdown(false);
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(
      subcategoryId === selectedSubcategory ? null : subcategoryId
    );
  };

  // Handle level selection
  const handleLevelSelect = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  // Handle language selection
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  // Handle rating selection
  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : rating);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedLevels([]);
    setSelectedLanguages([]);
    setSelectedRating(null);
    setSelectedPrice({ min: 0, max: 200 });
    setSortOption("popular");
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <div className="flex items-center mr-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= Math.round(rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{Number(rating).toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#a435f0] to-[#8710d8] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Expand Your Knowledge
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover thousands of courses taught by industry experts and take
              your skills to the next level.
            </p>
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a435f0]"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#a435f0] text-white px-4 py-2 rounded-lg hover:bg-[#8710d8] transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg
            viewBox="0 0 1440 100"
            className="absolute bottom-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div
        className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-shadow ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Category Dropdown (Mobile) */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                <span>{getActiveCategoryName()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute left-0 mt-2 w-64 rounded-lg bg-white shadow-xl border border-gray-200 z-40 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        !selectedCategory
                          ? "bg-[#f7f9fa] text-[#a435f0] font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <div key={category.id}>
                        <button
                          onClick={() => handleCategorySelect(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                            selectedCategory === category.id
                              ? "bg-[#f7f9fa] text-[#a435f0] font-medium"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span>{category.title}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        {selectedCategory === category.id && (
                          <div className="ml-4 border-l border-gray-200 pl-2 mt-1 mb-2">
                            {category.subcategories &&
                              category.subcategories.map((subcategory) => (
                                <button
                                  key={subcategory.id}
                                  onClick={() =>
                                    handleSubcategorySelect(subcategory.id)
                                  }
                                  className={`w-full text-left px-3 py-1.5 rounded-md ${
                                    selectedSubcategory === subcategory.id
                                      ? "bg-[#f7f9fa] text-[#a435f0] font-medium"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  {subcategory.title}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Navigation (Desktop) */}
            <div className="hidden md:flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-[#a435f0] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                All Categories
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-[#a435f0] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#a435f0]"
              >
                <option value="popular">Most Popular</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="h-1 w-5 bg-gray-700 rounded-full"></div>
                    <div className="h-1 w-5 bg-gray-700 rounded-full"></div>
                    <div className="h-1 w-5 bg-gray-700 rounded-full"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Subcategory Navigation (when a category is selected) */}
          {selectedCategory && (
            <div className="py-2 overflow-x-auto scrollbar-hide">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !selectedSubcategory
                      ? "bg-[#a435f0] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  All {getActiveCategoryName()}
                </button>

                {getSubcategories().map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubcategorySelect(subcategory.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedSubcategory === subcategory.id
                        ? "bg-[#a435f0] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {subcategory.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel (Desktop) */}
          {showFilters && (
            <div className="md:w-64 lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#a435f0] hover:underline"
                  >
                    Reset All
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: Number(e.target.value),
                          })
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Min"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: Number(e.target.value),
                          })
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced", "All Levels"].map(
                      (level) => (
                        <label key={level} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => handleLevelSelect(level)}
                            className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                          />
                          <span className="ml-2 text-sm">{level}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Language Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Language</h4>
                  <div className="space-y-2">
                    {["English", "French", "Spanish", "German", "Japanese"].map(
                      (language) => (
                        <label key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLanguages.includes(language)}
                            onChange={() => handleLanguageSelect(language)}
                            className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                          />
                          <span className="ml-2 text-sm">{language}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => handleRatingSelect(rating)}
                          className="rounded-full border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                        />
                        <span className="ml-2 flex items-center">
                          {renderStarRating(rating)}
                          <span className="ml-1 text-sm text-gray-600">
                            & up
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-2 rounded-lg bg-[#a435f0] text-white font-medium hover:bg-[#8710d8] transition-colors md:hidden"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedCategory
                  ? `${getActiveCategoryName()} ${
                      selectedSubcategory
                        ? `- ${getActiveSubcategoryName()}`
                        : ""
                    } Courses`
                  : "All Courses"}
              </h2>
              <p className="text-gray-600">
                {filteredCourses.length} results
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Courses */}
            {coursesData.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#a435f0] text-white rounded-lg hover:bg-[#8710d8] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {coursesData.map((course) => (
                  <motion.div
                    key={course.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    onMouseEnter={() => setHoveredCourse(course.id)}
                    onMouseLeave={() => setHoveredCourse(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <img
                        src={course.image_url || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      {hoveredCourse === course.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white p-2 rounded-full">
                            <Play className="h-8 w-8 text-[#a435f0]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.instructor.first_name}{" "}
                        {course.instructor.last_name}
                      </p>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(course.average_rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({course.total_reviews})
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600 space-x-3 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{course.level}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{course.total_students} étudiants</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span>{course.language}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center">
                          {course.discount > 0 ? (
                            <>
                              <span className="text-lg font-bold">
                                $
                                {(
                                  course.price *
                                  (1 - course.discount / 100)
                                ).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${course.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">
                              ${course.price}
                            </span>
                          )}
                        </div>

                        {isEnrolled(course.id) ? (
                          // Si l'utilisateur est inscrit, afficher le bouton "Suivre le cours"
                          <button
                            onClick={() =>
                              navigate(`/course/player/${course.id}`)
                            }
                            className="px-3 py-1.5 bg-[#a435f0] text-white text-sm font-medium rounded-lg hover:bg-[#8710d8] transition-colors flex items-center"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Suivre le cours
                          </button>
                        ) : (
                          // Si l'utilisateur n'est pas inscrit, afficher les boutons "Acheter" et "Voir les détails"
                          <div className="flex gap-2">
                            <button
                              onClick={() => purchaseCourse(course.id)}
                              className="px-3 py-1.5 bg-[#a435f0] text-white text-sm font-medium rounded-lg hover:bg-[#8710d8] transition-colors flex items-center"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />

                            </button>
                            <button
                              onClick={() => navigate(`/course/${course.id}`)}
                              className="px-3 py-1.5 bg-white border border-[#a435f0] text-[#a435f0] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              Détails
                            </button>
                            <Button
                              className={`px-3 py-3 rounded-lg font-medium transition-colors ${
                                wishlistedCourses.includes(course.id)
                                  ? "bg-red-100 text-red-500 hover:bg-red-200"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={(e) => toggleWishlist(course.id, e)}
                              aria-label={wishlistedCourses.includes(course.id) ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
                            >
                              <Heart
                                className={`h-5 w-5 ${
                                  wishlistedCourses.includes(course.id)
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredCourses.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === page
                            ? "bg-[#a435f0] text-white font-medium"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {/* Price Range Filter */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: Number(e.target.value),
                          })
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Min"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: Number(e.target.value),
                          })
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced", "All Levels"].map(
                      (level) => (
                        <label key={level} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => handleLevelSelect(level)}
                            className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                          />
                          <span className="ml-2 text-sm">{level}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Language Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Language</h4>
                  <div className="space-y-2">
                    {["English", "French", "Spanish", "German", "Japanese"].map(
                      (language) => (
                        <label key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLanguages.includes(language)}
                            onChange={() => handleLanguageSelect(language)}
                            className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                          />
                          <span className="ml-2 text-sm">{language}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => handleRatingSelect(rating)}
                          className="rounded-full border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                        />
                        <span className="ml-2 flex items-center">
                          {renderStarRating(rating)}
                          <span className="ml-1 text-sm text-gray-600">
                            & up
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 py-2.5 rounded-lg bg-[#a435f0] text-white font-medium hover:bg-[#8710d8] transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
