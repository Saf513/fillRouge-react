import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  ShoppingCart,
  Star,
  StarHalf,
  Clock,
  ChevronDown,
  Filter,
  Trash2,
  Bell,
  BellOff,
  Info,
  Search,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

// Types
interface Course {
  id: string
  title: string
  instructor: string
  instructorAvatar: string
  thumbnail: string
  rating: number
  reviewCount: number
  originalPrice: number
  currentPrice: number
  discount: number
  discountEnds?: string
  addedDate: string
  lastUpdated: string
  level: string
  duration: string
  category: string
  tags: string[]
  hasNotifications: boolean
  inCart: boolean
}

// Sample data
const sampleWishlistCourses: Course[] = [
  {
    id: "react-masterclass",
    title: "React Masterclass: Construisez des Applications Web Modernes",
    instructor: "Sophie Martin",
    instructorAvatar: "/placeholder.svg?height=50&width=50&text=SM",
    thumbnail: "/placeholder.svg?height=200&width=400&text=React+Masterclass",
    rating: 4.8,
    reviewCount: 4752,
    originalPrice: 89.99,
    currentPrice: 14.99,
    discount: 83,
    discountEnds: "2 jours restants",
    addedDate: "2023-10-15",
    lastUpdated: "2023-09-30",
    level: "Tous niveaux",
    duration: "42h",
    category: "Développement Web",
    tags: ["React", "JavaScript", "Frontend"],
    hasNotifications: true,
    inCart: false,
  },
  {
    id: "python-data-science",
    title: "Python pour la Data Science et l'Intelligence Artificielle",
    instructor: "Thomas Dubois",
    instructorAvatar: "/placeholder.svg?height=50&width=50&text=TD",
    thumbnail: "/placeholder.svg?height=200&width=400&text=Python+Data+Science",
    rating: 4.9,
    reviewCount: 8521,
    originalPrice: 129.99,
    currentPrice: 19.99,
    discount: 85,
    discountEnds: "5 jours restants",
    addedDate: "2023-10-10",
    lastUpdated: "2023-10-05",
    level: "Intermédiaire",
    duration: "38h",
    category: "Data Science",
    tags: ["Python", "Machine Learning", "Data Analysis"],
    hasNotifications: false,
    inCart: false,
  },
  {
    id: "ux-ui-design",
    title: "UX/UI Design: Créez des Interfaces Utilisateur Exceptionnelles",
    instructor: "Emma Laurent",
    instructorAvatar: "/placeholder.svg?height=50&width=50&text=EL",
    thumbnail: "/placeholder.svg?height=200&width=400&text=UX/UI+Design",
    rating: 4.7,
    reviewCount: 3254,
    originalPrice: 99.99,
    currentPrice: 16.99,
    discount: 83,
    discountEnds: "1 jour restant",
    addedDate: "2023-10-05",
    lastUpdated: "2023-09-15",
    level: "Débutant",
    duration: "28h",
    category: "Design",
    tags: ["UX", "UI", "Figma", "Adobe XD"],
    hasNotifications: true,
    inCart: true,
  },
  {
    id: "node-backend",
    title: "Node.js: Développement Backend Complet avec Express et MongoDB",
    instructor: "Lucas Bernard",
    instructorAvatar: "/placeholder.svg?height=50&width=50&text=LB",
    thumbnail: "/placeholder.svg?height=200&width=400&text=Node.js+Backend",
    rating: 4.6,
    reviewCount: 2187,
    originalPrice: 94.99,
    currentPrice: 13.99,
    discount: 85,
    discountEnds: "3 jours restants",
    addedDate: "2023-09-28",
    lastUpdated: "2023-09-10",
    level: "Intermédiaire",
    duration: "35h",
    category: "Développement Web",
    tags: ["Node.js", "Express", "MongoDB", "Backend"],
    hasNotifications: false,
    inCart: false,
  },
  {
    id: "flutter-mobile",
    title: "Flutter: Développement d'Applications Mobiles Multi-plateformes",
    instructor: "Camille Roux",
    instructorAvatar: "/placeholder.svg?height=50&width=50&text=CR",
    thumbnail: "/placeholder.svg?height=200&width=400&text=Flutter+Mobile",
    rating: 4.8,
    reviewCount: 1856,
    originalPrice: 109.99,
    currentPrice: 17.99,
    discount: 84,
    discountEnds: "4 jours restants",
    addedDate: "2023-09-20",
    lastUpdated: "2023-09-05",
    level: "Tous niveaux",
    duration: "45h",
    category: "Développement Mobile",
    tags: ["Flutter", "Dart", "iOS", "Android"],
    hasNotifications: true,
    inCart: false,
  },
]

const Wishlist = () => {
  const [wishlistCourses, setWishlistCourses] = useState<Course[]>(sampleWishlistCourses)
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(sampleWishlistCourses)
  const [isLoading, setIsLoading] = useState(true)
  const [sortOption, setSortOption] = useState("recently-added")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false)
  const [showPriceAlerts, setShowPriceAlerts] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter and sort courses
  useEffect(() => {
    let result = [...wishlistCourses]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((course) => course.category === selectedCategory)
    }

    // Apply price range filter
    result = result.filter((course) => course.currentPrice >= priceRange[0] && course.currentPrice <= priceRange[1])

    // Apply discount filter
    if (showDiscountedOnly) {
      result = result.filter((course) => course.discount > 0)
    }

    // Apply sorting
    switch (sortOption) {
      case "recently-added":
        result.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
        break
      case "price-low-high":
        result.sort((a, b) => a.currentPrice - b.currentPrice)
        break
      case "price-high-low":
        result.sort((a, b) => b.currentPrice - a.currentPrice)
        break
      case "highest-rated":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "most-recent":
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      default:
        break
    }

    setFilteredCourses(result)
  }, [wishlistCourses, sortOption, searchQuery, selectedCategory, priceRange, showDiscountedOnly])

  // Remove course from wishlist
  const removeCourse = (courseId: string) => {
    setWishlistCourses((prev) => prev.filter((course) => course.id !== courseId))
  }

  // Toggle notification for a course
  const toggleNotification = (courseId: string) => {
    setWishlistCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, hasNotifications: !course.hasNotifications } : course,
      ),
    )
  }

  // Add course to cart
  const addToCart = (courseId: string) => {
    setWishlistCourses((prev) => prev.map((course) => (course.id === courseId ? { ...course, inCart: true } : course)))
  }

  // Remove all courses from wishlist
  const clearWishlist = () => {
    setWishlistCourses([])
  }

  // Get unique categories for filter
  const categories = ["all", ...Array.from(new Set(wishlistCourses.map((course) => course.category)))]

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" size={16} />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300" size={16} />)
    }

    return stars
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ma liste de souhaits</h1>
            <p className="text-gray-600">{wishlistCourses.length} cours enregistrés pour plus tard</p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Vider la liste
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Vider votre liste de souhaits ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera tous les cours de votre liste de souhaits. Cette action ne peut pas être
                    annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={clearWishlist}>
                    Vider la liste
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button className="bg-orange-500 hover:bg-orange-600">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Tout ajouter au panier
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher dans ma liste de souhaits..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recently-added">Ajoutés récemment</SelectItem>
                  <SelectItem value="price-low-high">Prix croissant</SelectItem>
                  <SelectItem value="price-high-low">Prix décroissant</SelectItem>
                  <SelectItem value="highest-rated">Mieux notés</SelectItem>
                  <SelectItem value="most-recent">Récemment mis à jour</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-4" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Catégorie</h4>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {categories
                            .filter((cat) => cat !== "all")
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Prix</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{priceRange[0]}€</span>
                        <span className="text-sm">{priceRange[1]}€</span>
                      </div>
                      {/* This is a simplified price range - in a real app you'd use a proper range slider */}
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPriceRange([0, 200])}
                          className={
                            priceRange[0] === 0 && priceRange[1] === 200 ? "bg-orange-100 border-orange-200" : ""
                          }
                        >
                          Tous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPriceRange([0, 20])}
                          className={
                            priceRange[0] === 0 && priceRange[1] === 20 ? "bg-orange-100 border-orange-200" : ""
                          }
                        >
                          0€ - 20€
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPriceRange([20, 50])}
                          className={
                            priceRange[0] === 20 && priceRange[1] === 50 ? "bg-orange-100 border-orange-200" : ""
                          }
                        >
                          20€ - 50€
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="discount-filter"
                        checked={showDiscountedOnly}
                        onCheckedChange={setShowDiscountedOnly}
                      />
                      <Label htmlFor="discount-filter">Uniquement en promotion</Label>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="price-alerts" checked={showPriceAlerts} onCheckedChange={setShowPriceAlerts} />
              <Label htmlFor="price-alerts" className="flex items-center">
                <span>Alertes de prix</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Recevez des notifications lorsque les cours de votre liste de souhaits sont en promotion.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>

            <div className="text-sm text-gray-500">
              {filteredCourses.length} résultat{filteredCourses.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Wishlist Courses */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                <Skeleton className="h-40 w-full md:w-64 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlistCourses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Votre liste de souhaits est vide</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Explorez nos cours et ajoutez ceux qui vous intéressent à votre liste de souhaits pour les retrouver
              facilement plus tard.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600">Explorer les cours</Button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Aucun résultat trouvé</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Aucun cours ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setPriceRange([0, 200])
                setShowDiscountedOnly(false)
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-64 h-40">
                      <Image
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      {course.discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500">-{course.discount}%</Badge>
                      )}
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <Link href={`/courses/${course.id}`} className="hover:underline">
                            <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                          </Link>

                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <span>Par {course.instructor}</span>
                            <span className="mx-2">•</span>
                            <span>{course.level}</span>
                            <span className="mx-2">•</span>
                            <span>{course.duration}</span>
                          </div>

                          <div className="flex items-center mb-2">
                            <div className="flex mr-1">{renderStars(course.rating)}</div>
                            <span className="text-sm font-medium">{course.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({course.reviewCount})</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Ajouté le {formatDate(course.addedDate)}</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {course.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="bg-gray-50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                          <div className="mb-2">
                            <div className="text-2xl font-bold">{course.currentPrice.toFixed(2)} €</div>
                            {course.discount > 0 && (
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 line-through mr-2">
                                  {course.originalPrice.toFixed(2)} €
                                </span>
                                {course.discountEnds && (
                                  <Badge variant="outline" className="text-red-500 border-red-200">
                                    {course.discountEnds}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            {course.inCart ? (
                              <Button className="bg-green-500 hover:bg-green-600" disabled>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Dans le panier
                              </Button>
                            ) : (
                              <Button
                                className="bg-orange-500 hover:bg-orange-600"
                                onClick={() => addToCart(course.id)}
                              >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Ajouter au panier
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleNotification(course.id)}>
                                  {course.hasNotifications ? (
                                    <>
                                      <BellOff className="mr-2 h-4 w-4" />
                                      <span>Désactiver les alertes</span>
                                    </>
                                  ) : (
                                    <>
                                      <Bell className="mr-2 h-4 w-4" />
                                      <span>Activer les alertes</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => removeCourse(course.id)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                  <span className="text-red-500">Retirer de la liste</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {wishlistCourses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Vous pourriez aussi aimer</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={`/placeholder.svg?height=200&width=400&text=Cours ${index + 1}`}
                        alt={`Cours recommandé ${index + 1}`}
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      {index % 2 === 0 && <Badge className="absolute top-2 left-2 bg-red-500">-80%</Badge>}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-bold mb-1 line-clamp-2">
                        {index === 0
                          ? "JavaScript Avancé: Patterns et Performance"
                          : index === 1
                            ? "Marketing Digital Complet"
                            : index === 2
                              ? "Développement iOS avec Swift"
                              : "Photographie Professionnelle"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {index === 0
                          ? "Marc Dubois"
                          : index === 1
                            ? "Julie Moreau"
                            : index === 2
                              ? "Antoine Lefèvre"
                              : "Céline Petit"}
                      </p>
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-1">{4.5 + index * 0.1}</span>
                        <div className="flex">{renderStars(4.5 + index * 0.1)}</div>
                        <span className="text-xs text-gray-500 ml-1">({1200 + index * 300})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-bold">{14.99 + index * 5} €</div>
                        <div className="text-sm text-gray-500 line-through">{89.99} €</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
