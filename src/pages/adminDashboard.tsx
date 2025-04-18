import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "@/hooks/useCategories";
import useCourses from "@/hooks/useCourses";
import { Course } from "@/types/course";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  Users,
  BookOpen,
  Heart,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  ShoppingCart,
} from "lucide-react";

export default function CoursesExplorer() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

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
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
    total,
    currentPage,
    perPage,
    setCurrentPage,
  } = useCourses();

  // Filter courses based on search, category, and other filters
  const filteredCourses = useCallback(() => {
    if (!courses) return [];

    return courses
      .filter((course: Course) => {
        // Filtre du terme de recherche
        const searchMatch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course?.subtitle &&
            course.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtre de catégorie
        const categoryMatch =
          !selectedCategory ||
          (course?.category_id &&
            course.category_id.toString() === selectedCategory);

        // Subcategory filter
        const subcategoryMatch =
          !selectedSubcategory ||
          course?.categories.some((category) =>
            category.subcategories?.some(
              (subcategory) => subcategory.id === selectedSubcategory
            )
          );
        // Filtre de prix
        const price = course.discount
          ? (Number(course.price) || 0) * (1 - (Number(course.discount) || 0) / 100)
          : Number(course.price) || 0;
        const priceMatch = price >= priceRange[0] && price <= priceRange[1];

        // Filtre de niveau
        const levelMatch =
          selectedLevels.length === 0 || selectedLevels.includes(course.level);

        // Language filter
        const languageMatch =
          selectedLanguages.length === 0 ||
          selectedLanguages.includes(course.language);

        // Filtre de notation
        const ratingMatch =
          !selectedRating || parseFloat(course.average_rating) >= selectedRating;

        return (
          searchMatch &&
          categoryMatch &&
          subcategoryMatch &&
          levelMatch &&
          languageMatch &&
          ratingMatch &&
          priceMatch
        );
      })
      .sort((a: Course, b: Course) => {
        // Sort based on selected option
        switch (sortOption) {
          case "popular":
            return b.total_students - a.total_students;
          case "highest-rated":
            return parseFloat(b.average_rating) - parseFloat(a.average_rating);
          case "newest":
            return (
              new Date(b.created_at || "").getTime() -
              new Date(a.created_at || "").getTime()
            );
          case "price-low":
            return (
              parseFloat(a.price) * (1 - parseFloat(a.discount) / 100) -
              parseFloat(b.price) * (1 - parseFloat(b.discount) / 100)
            );
          case "price-high":
            return (
              parseFloat(b.price) * (1 - parseFloat(b.discount) / 100) -
              parseFloat(a.price) * (1 - parseFloat(a.discount) / 100)
            );
          default:
            return 0;
        }
      });
  }, [
    courses,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    selectedLevels,
    selectedLanguages,
    selectedRating,
    sortOption,
  ]);

  if (categoriesLoading || coursesLoading) {
    return <div>Chargement des données...</div>;
  }

  if (categoriesError) {
    return <div>Erreur: {categoriesError}</div>;
  }

  if (coursesError) {
    return <div>Erreur: {coursesError}</div>;
  }

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

  // Handle price range change
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedLevels([]);
    setSelectedLanguages([]);
    setSelectedRating(null);
    setPriceRange([0, 200]);
    setSortOption("popular");
  };

  // Get active category name
  const getActiveCategoryName = useCallback(() => {
    if (!selectedCategory) return "All Categories";
    const category = categories.find((c) => c.id === selectedCategory);
    return category ? category.title : "All Categories";
  }, [categories, selectedCategory]);

  // Get active subcategory name
  const getActiveSubcategoryName = useCallback(() => {
    if (!selectedSubcategory) return "All Subcategories";
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category || !category.subcategories) return "All Subcategories";
    const subcategory = category.subcategories.find(
      (s) => s.id === selectedSubcategory
    );
    return subcategory ? subcategory.title : "All Subcategories";
  }, [categories, selectedCategory, selectedSubcategory]);

  // Get subcategories for a given category
  const getSubcategories = useCallback(() => {
    if (!selectedCategory) return [];
    const category = categories.find((c) => c.id === selectedCategory);
    return category && category.subcategories ? category.subcategories : [];
  }, [categories, selectedCategory]);

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
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      ${priceRange[0]}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${priceRange[1]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceRangeChange([
                        priceRange[0],
                        Number.parseInt(e.target.value),
                      ])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#a435f0]"
                  />
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
                {filteredCourses().length} results
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Courses */}
            {filteredCourses().length === 0 ? (
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
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {filteredCourses().map((course) => (
                  <motion.div
                    key={course.id}
                    className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}
                    onMouseEnter={() => setHoveredCourse(course.id.toString())}
                    onMouseLeave={() => setHoveredCourse(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`relative ${
                        viewMode === "list" ? "md:w-64 flex-shrink-0" : ""
                      }`}
                    >
                      <img
                        src={course.image_url || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      {course.bestseller && (
                        <div className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                          BESTSELLER
                        </div>
                      )}
                      {course.new && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </div>
                      )}
                      {hoveredCourse === course.id.toString() && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white p-2 rounded-full">
                            <Play className="h-8 w-8 text-[#a435f0]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg line-clamp-2">
                          {course.title}
                        </h3>
                        <button className="flex-shrink-0 ml-2 text-gray-400 hover:text-[#a435f0]">
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {course.instructor.first_name}{" "}
                        {course.instructor.last_name}
                      </p>

                      <div className="flex items-center mb-2">
                        {renderStarRating(course.average_rating)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({course.reviewCount?.toLocaleString()})
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600 space-x-3 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>
                            {course.studentsCount?.toLocaleString()} students
                          </span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span>{course.level}</span>
                        </div>
                      </div>

                      {viewMode === "list" && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center">
                          {course.discount ? (
                            <>
                              <span className="text-lg font-bold">
                                $
                                {(
                                  course.price *
                                  (1 - course.discount / 100)
                                ).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${Number(course.price).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">
                              ${Number(course.price).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button className="p-1.5 bg-[#a435f0] text-white text-sm font-medium rounded-lg hover:bg-[#8710d8] transition-colors">
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="p-1.5 bg-[#a435f0] text-white text-sm font-medium rounded-lg hover:bg-[#8710d8] transition-colors"
                          >
                            <BookOpen className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredCourses().length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from(
                    { length: Math.ceil(total / perPage) },
                    (_, i) => i + 1
                  ).map((page) => (
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
                  ))}
                  <button
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(total / perPage)}
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
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      ${priceRange[0]}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${priceRange[1]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceRangeChange([
                        priceRange[0],
                        Number.parseInt(e.target.value),
                      ])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#a435f0]"
                  />
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
