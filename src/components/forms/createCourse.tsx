import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import useCategories from "@/hooks/useCategories";
import { courseService } from "@/services/courseService";
import { Lesson } from "@/types/course";
import { Section } from "@/types/course";
import { Course } from "@/types/course";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Video,
  FileText,
  CheckCircle2,
  PenTool,
  Clock,
  Upload,
  ArrowLeft,
  ArrowRight,
  File,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import { json } from "stream/consumers";

const CourseCreationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  // État pour les données du cours
  const [course, setCourse] = useState<Course>({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    category_id: "",
    subcategory: "",
    level: "beginner",
    language: "en",
    price: 0,
    salePrice: 0,
    image_url: "",
    instructor_id: parseInt(localStorage.getItem("userId") || "0", 10),
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sections: [],
    tags: [],
    what_you_will_learn: [],
    requirements: [],
    instructor: {
      id: parseInt(localStorage.getItem("userId") || "0", 10),
      first_name: "",
      last_name: "",
      email: "",
      avatar_url: "",
      bio: "",
    },
    discount: 0
  });

  //les states pour les lessons et les coures
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "section" | "lesson";
    id: string;
    sectionId?: string;
  } | null>(null);

  // les states pour les inputes
  const [newRequirement, setNewRequirement] = useState("");
  const [newLearningOutcome, setNewLearningOutcome] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // les states pour aploading
  const [fileUploading, setFileUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // handler la selection de file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentLesson) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      
      // Mise à jour de la leçon avec les bonnes valeurs
      setCurrentLesson({
        ...currentLesson,
        content_type: "pdf" as const, // Utilisation de "as const" pour le type littéral
        content_url: fileUrl,
        duration: "0", // Valeur par défaut pour la durée
        pdf_url: fileUrl // Stockage de l'URL du PDF
      });
    }
  };

  const handleFileUpload = async (lessonId: string) => {
    if (!selectedFile || !currentLesson) return;

    try {
      setFileUploading(true);

      const fileType = selectedFile.type.includes("pdf") ? "pdf" : "other";
      const response = await courseService.uploadAttachment(
        selectedFile,
        lessonId
      );

      // Update the current lesson with the new attachment
      const newAttachment = {
        name: selectedFile.name,
        url: response.url,
        size: `${Math.round(selectedFile.size / 1024)} KB`,
        type: fileType,
      };

      const updatedAttachments = currentLesson.attachments
        ? [...currentLesson.attachments, newAttachment]
        : [newAttachment];

      setCurrentLesson({
        ...currentLesson,
        attachments: updatedAttachments,
      });

      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} has been attached to this lesson.`,
      });

      setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: ` There was an error uploading your file. Please try again${error}`,
        variant: "destructive",
      });
    } finally {
      setFileUploading(false);
    }
  };

  // Toggle section expand/collapse
  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Add a new section
  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "",
      description: "",
      order: course.sections ? course.sections.length + 1 : 1,
      lessons: [],
    };

    setCurrentSection(newSection);
    setShowSectionDialog(true);
  };

  // Save section
  const handleSaveSection = () => {
    if (!currentSection) return;

    if (currentSection.title.trim() === "") {
      toast({
        title: "Section title required",
        description: "Please provide a title for the section.",
        variant: "destructive",
      });
      return;
    }

    const isEditing = course.sections?.some(
      (section) => section.id === currentSection.id
    );
    let updatedSections;

    if (isEditing) {
      updatedSections = course.sections?.map((section) =>
        section.id === currentSection.id ? currentSection : section
      );
    } else {
      updatedSections = course.sections
        ? [...course.sections, currentSection]
        : [currentSection];
    }

    setCourse({
      ...course,
      sections: updatedSections,
    });

    // Expand the new section
    if (!isEditing) {
      setExpandedSections([...expandedSections, currentSection.id]);
    }

    setShowSectionDialog(false);
    setCurrentSection(null);
  };

  // Edit section
  const handleEditSection = (section: Section) => {
    setCurrentSection({ ...section });
    setShowSectionDialog(true);
  };

  // Add a new lesson to a section
  const handleAddLesson = (sectionId: string) => {
    const section = course.sections?.find((s) => s.id === sectionId);
    if (!section) return;

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      section_id: parseInt(sectionId),
      title: "",
      description: "",
      content_type: "video",
      content_url: "",
      duration: "0:00",
      order: section.lessons.length + 1,
      attachments: [],
    };

    setCurrentSection({ ...section });
    setCurrentLesson(newLesson);
    setShowLessonDialog(true);
  };

  // Save lesson
  const handleSaveLesson = () => {
    if (!currentSection || !currentLesson) return;

    // Validation des champs requis
    if (currentLesson.title.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le titre de la leçon est requis",
        variant: "destructive",
      });
      return;
    }

    // Conversion de la durée en nombre entier
    const durationInSeconds = parseInt(currentLesson.duration) || 0;

    // Préparation des données de la leçon
    const lessonData = {
      ...currentLesson,
      duration: durationInSeconds.toString(),
      content_type: currentLesson.content_type,
      content_url: currentLesson.pdf_url || currentLesson.content_url || "",
      section_id: parseInt(currentSection.id)
    };

    const isEditing = currentSection.lessons.some(
      (lesson) => lesson.id === currentLesson.id
    );

    let updatedLessons;
    if (isEditing) {
      updatedLessons = currentSection.lessons.map((lesson) =>
        lesson.id === currentLesson.id ? lessonData : lesson
      );
    } else {
      updatedLessons = [...currentSection.lessons, lessonData];
    }

    const updatedSection = {
      ...currentSection,
      lessons: updatedLessons,
    };

    const updatedSections = course.sections?.map((section) =>
      section.id === updatedSection.id ? updatedSection : section
    );

    setCourse({
      ...course,
      sections: updatedSections,
    });

    setShowLessonDialog(false);
    setCurrentLesson(null);
    setCurrentSection(null);
  };

  // Edit lesson
  const handleEditLesson = (sectionId: string, lessonId: string) => {
    const section = course.sections?.find((s) => s.id === sectionId);
    if (!section) return;

    const lesson = section.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    setCurrentSection({ ...section });
    setCurrentLesson({ ...lesson });
    setShowLessonDialog(true);
  };

  // Delete section or lesson
  const handleDelete = (
    type: "section" | "lesson",
    id: string,
    sectionId?: string
  ) => {
    setItemToDelete({ type, id, sectionId });
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "section") {
      setCourse({
        ...course,
        sections: course.sections?.filter(
          (section) => section.id !== itemToDelete.id
        ),
      });
    } else if (itemToDelete.type === "lesson" && itemToDelete.sectionId) {
      const section = course.sections?.find(
        (s) => s.id === itemToDelete.sectionId
      );
      if (!section) return;

      const updatedSection = {
        ...section,
        lessons: section.lessons.filter(
          (lesson) => lesson.id !== itemToDelete.id
        ),
      };

      setCourse({
        ...course,
        sections: course.sections?.map((s) =>
          s.id === itemToDelete.sectionId ? updatedSection : s
        ),
      });
    }

    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // Dropped outside the list
    if (!destination) return;

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Reordering sections
    if (type === "SECTION") {
      const reorderedSections = Array.from(course.sections || []);
      const [removed] = reorderedSections.splice(source.index, 1);
      reorderedSections.splice(destination.index, 0, removed);

      // Update order property
      const updatedSections = reorderedSections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      setCourse({
        ...course,
        sections: updatedSections,
      });
      return;
    }

    // Reordering lessons within the same section
    if (type === "LESSON" && source.droppableId === destination.droppableId) {
      const sectionId = source.droppableId;
      const section = course.sections?.find((s) => s.id === sectionId);
      if (!section) return;

      const reorderedLessons = Array.from(section.lessons);
      const [removed] = reorderedLessons.splice(source.index, 1);
      reorderedLessons.splice(destination.index, 0, removed);

      // Update order property
      const updatedLessons = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const updatedSections = course.sections?.map((s) =>
        s.id === sectionId ? { ...s, lessons: updatedLessons } : s
      );

      setCourse({
        ...course,
        sections: updatedSections,
      });
    }
  };

  // Add a requirement
  const handleAddRequirement = () => {
    if (newRequirement.trim() === "") return;
    setCourse({
      ...course,
      requirements: course.requirements
        ? [...course.requirements, newRequirement]
        : [newRequirement],
    });
    setNewRequirement("");
  };

  // Remove a requirement
  const handleRemoveRequirement = (index: number) => {
    setCourse({
      ...course,
      requirements: course.requirements?.filter((_, i) => i !== index),
    });
  };

  // Add a learning outcome
  const handleAddLearningOutcome = () => {
    if (newLearningOutcome.trim() === "") return;
    setCourse({
      ...course,
      what_you_will_learn: course.what_you_will_learn
        ? [...course.what_you_will_learn, newLearningOutcome]
        : [newLearningOutcome],
    });
    setNewLearningOutcome("");
  };

  // Remove a learning outcome
  const handleRemoveLearningOutcome = (index: number) => {
    setCourse({
      ...course,
      what_you_will_learn: course.what_you_will_learn?.filter(
        (_, i) => i !== index
      ),
    });
  };

  // Add a tag
  const handleAddTag = () => {
    if (selectedTag && !course.tags.includes(selectedTag)) {
      setCourse({
        ...course,
        tags: [...course.tags, selectedTag],
      });
      setSelectedTag("");
    }
  };

  // Remove a tag
  const handleRemoveTag = (tag: string) => {
    setCourse({
      ...course,
      tags: course.tags.filter((t) => t !== tag),
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate course data
    if (!course.title || !course.description || !course.category_id) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!course.sections || course.sections.length === 0) {
      toast({
        title: "Aucun section ajoutée",
        description: "Veuillez ajouter au moins une section à votre cours.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Check if all sections have at least one lesson
    const emptySections = course.sections.filter(
      (section) => section.lessons.length === 0
    );
    if (emptySections.length > 0) {
      toast({
        title: "Empty sections",
        description: `${emptySections.length} section(s) have no lessons. Please add at least one lesson to each section.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const authDataString = localStorage.getItem("auth-storage");

    if (!authDataString) {
      toast({
        title: "Erreur d'authentification",
        description: "Aucune donnée d'authentification trouvée.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const authData = JSON.parse(authDataString);
    const userId = authData?.state?.user?.id;

    if (!userId) {
      toast({
        title: "Erreur d'authentification",
        description: "Aucun identifiant d'utilisateur trouvé.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Créer le cours de base
      const courseData = {
        title: course.title,
        description: course.description,
        category_id: course.category_id,
        level: course.level,
        language: course.language,
        instructor_id: userId,
        price: course.price,
        discount: course.discount,
      };

      const createdCourse = await courseService.createCourse(courseData);
      console.log(createdCourse);

      const courseId = createdCourse.data.id;

      // 2. Ajouter les sections et leurs leçons
      for (const section of course.sections) {
        // Créer la section
        const createdSection = await courseService.addSection(courseId, {
          title: section.title,
          description: section.description,
          order: section.order,
        });
        console.log("section :", createdSection);
        
        // Ajouter les leçons de la section
        for (const lesson of section.lessons) {
          const lessonData = {
            title: lesson.title,
            description: lesson.description,
            content_type: lesson.content_type,
            duration: lesson.duration,
            content_url: lesson.content_url,
            order: lesson.order,
          }
          console.log(lessonData)
          await courseService.addLesson(courseId, createdSection,lessonData);
        }
      }

      // 3. Ajouter les tags
      if (course.tags && course.tags.length > 0) {
        for (const tag of course.tags) {
          await courseService.addTag(tag);
        }
      }

      toast({
        title: "Course created successfully",
        description: "Your course has been created and is now in draft mode.",
      });

      // Redirect to the teacher dashboard
      navigate("/teacher-dashboard");
    } catch (error) {
      toast({
        title: "Error creating course",
        description: `There was an error creating your course. Please try again.${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation between steps
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Basic Information</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={course.title}
                  onChange={(e) =>
                    setCourse({ ...course, title: e.target.value })
                  }
                  placeholder="e.g. Complete Web Development Bootcamp 2023"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subtitle">Course Subtitle *</Label>
                <Input
                  id="subtitle"
                  value={course.subtitle}
                  onChange={(e) =>
                    setCourse({ ...course, subtitle: e.target.value })
                  }
                  placeholder="e.g. Learn web development from scratch"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  value={course.description}
                  onChange={(e) =>
                    setCourse({ ...course, description: e.target.value })
                  }
                  placeholder="Provide a detailed description of your course"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={course.category_id}
                    onValueChange={(value: string) =>
                      setCourse({
                        ...course,
                        category_id: value,
                        subcategory: "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : categoriesError ? (
                        <SelectItem value="error" disabled>
                          Error loading categories
                        </SelectItem>
                      ) : (
                        Array.isArray(categories) &&
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={course.subcategory}
                    onValueChange={(value: string) =>
                      setCourse({ ...course, subcategory: value })
                    }
                    disabled={!course.category_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {course.category_id &&
                        Array.isArray(categories) &&
                        categories
                          .find((cat) => cat.id === course.category_id)
                          ?.subcategories?.map((subcategory) => (
                            <SelectItem
                              key={subcategory.id}
                              value={subcategory.id}
                            >
                              {subcategory.title}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={course.level}
                    onValueChange={(value) =>
                      setCourse({
                        ...course,
                        level: value as
                          | "beginner"
                          | "intermediate"
                          | "advanced",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="language">Language *</Label>
                  <Select
                    value={course.language}
                    onValueChange={(value) =>
                      setCourse({ ...course, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Regular Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={course.price}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        price: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="salePrice">Sale Price ($)</Label>
                    <Checkbox
                      checked={course.salePrice !== undefined}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCourse({
                            ...course,
                            salePrice: course.price * 0.8,
                          });
                        } else {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { salePrice, ...rest } = course;
                          setCourse(rest as Course);
                        }
                      }}
                    />
                  </div>
                  <Input
                    id="salePrice"
                    type="number"
                    value={course.salePrice || ""}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        salePrice: Number.parseFloat(e.target.value),
                      })
                    }
                    disabled={course.salePrice === undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Course Content</h2>
            <p className="text-muted-foreground">
              Create sections and lessons for your course. Drag and drop to
              reorder them.
            </p>

            <Button
              onClick={handleAddSection}
              variant="outline"
              className="w-full py-8 border-dashed flex items-center justify-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Section
            </Button>

            {course.sections && course.sections.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections" type="SECTION">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {course.sections.map((section, sectionIndex) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={sectionIndex}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border rounded-lg ${
                                snapshot.isDragging
                                  ? "bg-muted shadow-lg"
                                  : "bg-card"
                              }`}
                            >
                              <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-2 cursor-grab"
                                  >
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => toggleSection(section.id)}
                                  >
                                    <button className="mr-1">
                                      {expandedSections.includes(section.id) ? (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </button>
                                    <div>
                                      <h3 className="font-medium text-lg">
                                        {sectionIndex + 1}. {section.title}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {section.lessons.length} lessons •{" "}
                                        {section.lessons.reduce(
                                          (acc, lesson) => {
                                            const [min, sec] = lesson.duration
                                              .split(":")
                                              .map(Number);
                                            return acc + min * 60 + (sec || 0);
                                          },
                                          0
                                        ) / 60}{" "}
                                        min
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditSection(section)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="ml-1 hidden md:inline">
                                      Edit
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddLesson(section.id)}
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span className="ml-1 hidden md:inline">
                                      Add Lesson
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDelete("section", section.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Lessons container */}
                              {expandedSections.includes(section.id) && (
                                <div className="border-t px-4 py-2">
                                  <Droppable
                                    droppableId={section.id}
                                    type="LESSON"
                                  >
                                    {(provided) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                      >
                                        {section.lessons.map(
                                          (lesson, lessonIndex) => (
                                            <Draggable
                                              key={lesson.id}
                                              draggableId={lesson.id}
                                              index={lessonIndex}
                                            >
                                              {(provided, snapshot) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className={`flex items-center p-2 rounded-md ${
                                                    snapshot.isDragging
                                                      ? "bg-muted shadow-md"
                                                      : "hover:bg-muted/50"
                                                  }`}
                                                >
                                                  <div className="flex items-center flex-1">
                                                    <div
                                                      {...provided.dragHandleProps}
                                                      className="mr-2 cursor-grab"
                                                    >
                                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    </div>

                                                    <div
                                                      className={`mr-3 flex h-7 w-7 items-center justify-center rounded-full
                                                    ${
                                                      lesson.content_type === "video"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : lesson.content_type === "article"
                                                        ? "bg-purple-100 text-purple-600"
                                                        : lesson.content_type === "quiz"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-amber-100 text-amber-600"
                                                    }`}
                                                    >
                                                      {lesson.content_type === "video" ? (
                                                        <Video className="h-3.5 w-3.5" />
                                                      ) : lesson.content_type === "article" ? (
                                                        <FileText className="h-3.5 w-3.5" />
                                                      ) : lesson.content_type === "quiz" ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                      ) : (
                                                        <PenTool className="h-3.5 w-3.5" />
                                                      )}
                                                    </div>

                                                    <div className="flex-1">
                                                      <div className="flex items-center">
                                                        <span className="font-medium">
                                                          {sectionIndex + 1}.
                                                          {lessonIndex + 1}{" "}
                                                          {lesson.title}
                                                        </span>
                                                        {lesson.preview && (
                                                          <Badge className="ml-2 text-xs bg-purple-100 text-purple-600 hover:bg-purple-100">
                                                            Preview
                                                          </Badge>
                                                        )}
                                                      </div>
                                                      <div className="flex items-center text-xs text-muted-foreground">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        {lesson.duration}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="flex items-center gap-1">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                        handleEditLesson(
                                                          section.id,
                                                          lesson.id
                                                        )
                                                      }
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                      <span className="ml-1 hidden md:inline">
                                                        Edit
                                                      </span>
                                                    </Button>

                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="text-red-600"
                                                      onClick={() =>
                                                        handleDelete(
                                                          "lesson",
                                                          lesson.id,
                                                          section.id
                                                        )
                                                      }
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        )}
                                        {provided.placeholder}

                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            handleAddLesson(section.id)
                                          }
                                          className="w-full mt-2 border border-dashed text-muted-foreground"
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Lesson
                                        </Button>
                                      </div>
                                    )}
                                  </Droppable>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun section pour l'instant
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding a section to your course. Each section can
                  contain multiple lessons.
                </p>
                <Button
                  onClick={handleAddSection}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Section
                </Button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Course Details</h2>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Image du cours</CardTitle>
                  <CardDescription>
                    Téléchargez une image de haute qualité qui représente votre
                    cours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <img
                        src={
                          course.image_url ||
                          "/placeholder.svg?height=400&width=600"
                        }
                        alt="Miniature du cours"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Button variant="secondary">
                          <Upload className="mr-2 h-4 w-4" />
                          Télécharger l'image
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Taille recommandée : 1280x720 pixels (ratio 16:9)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Tags</CardTitle>
                  <CardDescription>
                    Add tags to help students find your course.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {course.tags &&
                        course.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-sm"
                          >
                            {tag}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      {course.tags && course.tags.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No tags added yet
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={selectedTag}
                        onValueChange={setSelectedTag}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                        <Input
                          placeholder="Ajouter un tag"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                        />
                      </Select>
                      <Button variant="outline" onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What Students Will Learn</CardTitle>
                  <CardDescription>
                    List the key learning outcomes for your course.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.what_you_will_learn &&
                      course.what_you_will_learn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex gap-2">
                              <p className="flex-1">{item}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveLearningOutcome(index)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {course.what_you_will_learn &&
                      course.what_you_will_learn.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No learning outcomes added yet
                        </p>
                      )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a learning outcome"
                        value={newLearningOutcome}
                        onChange={(e) => setNewLearningOutcome(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddLearningOutcome();
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={handleAddLearningOutcome}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>
                    List any prerequisites or requirements for taking this
                    course.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.requirements?.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mt-2" />
                        <div className="flex-1">
                          <div className="flex gap-2">
                            <p className="flex-1">{item}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveRequirement(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {course.requirements?.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Aucun prérequis ajouté pour l'instant
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a requirement"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddRequirement();
                          }
                        }}
                      />
                      <Button variant="outline" onClick={handleAddRequirement}>
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Review & Submit</h2>
            <p className="text-muted-foreground">
              Review your course details before submitting. Your course will be
              created in draft mode.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Course Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Title
                      </h3>
                      <p>{course.title}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Subtitle
                      </h3>
                      <p>{course.subtitle}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Description
                    </h3>
                    <p className="line-clamp-3">{course.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Category
                      </h3>
                      <p>
                        {categories &&
                          course.category_id &&
                          categories.find((c) => c.id === course.category_id)
                            ?.title}
                        {course.subcategory &&
                          categories &&
                          course.category_id &&
                          ` / ${
                            categories
                              .find((c) => c.id === course.category_id)
                              ?.subcategories?.find(
                                (s) => s.id === course.subcategory
                              )?.title || ""
                          }`}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Level
                      </h3>
                      <p>
                        {course.level.charAt(0).toUpperCase() +
                          course.level.slice(1)}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Language
                      </h3>
                      <p>
                        {course.language.charAt(0).toUpperCase() +
                          course.language.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Price
                      </h3>
                      <p>${course.price.toFixed(2)}</p>
                    </div>
                    {course.salePrice && (
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Sale Price
                        </h3>
                        <p>${course.salePrice.toFixed(2)}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Course Content
                    </h3>
                    <p>
                      {course.sections?.length || 0} sections •{" "}
                      {course.sections?.reduce(
                        (total, section) => total + section.lessons.length,
                        0
                      ) || 0}
                      lessons
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {course.tags &&
                        course.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      {course.tags && course.tags.length === 0 && (
                        <p>No tags added</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>After creating your course, you'll be able to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Upload videos and other content for your lessons</li>
                    <li>Preview your course as a student would see it</li>
                    <li>Set up quizzes and assignments</li>
                    <li>
                      Submit your course for review when it's ready to publish
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? "Creating Course..." : "Create Course"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/teacher-dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Create New Course</h1>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center ${index > 0 ? "flex-1" : ""}`}
              onClick={() => setCurrentStep(index + 1)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index + 1 <= currentStep
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } cursor-pointer`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    index + 1 < currentStep ? "bg-purple-600" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm">Basic Info</div>
          <div className="text-sm">Content</div>
          <div className="text-sm">Details</div>
          <div className="text-sm">Review</div>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < totalSteps ? (
          <Button
            onClick={goToNextStep}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? "Creating Course..." : "Create Course"}
          </Button>
        )}
      </div>

      {/* Section Dialog */}
      <Dialog
        open={showSectionDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowSectionDialog(false);
            setCurrentSection(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentSection?.title ? "Edit Section" : "Add New Section"}
            </DialogTitle>
            <DialogDescription>
              {currentSection?.title
                ? "Update the details for this section"
                : "Add a new section to your course"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sectionTitle">Section Title *</Label>
              <Input
                id="sectionTitle"
                value={currentSection?.title || ""}
                onChange={(e) =>
                  currentSection &&
                  setCurrentSection({
                    ...currentSection,
                    title: e.target.value,
                  })
                }
                placeholder="e.g. Introduction to the Course"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sectionDescription">Description (Optional)</Label>
              <Textarea
                id="sectionDescription"
                value={currentSection?.description || ""}
                onChange={(e) =>
                  currentSection &&
                  setCurrentSection({
                    ...currentSection,
                    description: e.target.value,
                  })
                }
                placeholder="Briefly describe what this section covers"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSectionDialog(false);
                setCurrentSection(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSection}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog
        open={showLessonDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowLessonDialog(false);
            setCurrentLesson(null);
            setCurrentSection(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentLesson?.title ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
            <DialogDescription>
              {currentLesson?.title
                ? "Update the details for this lesson"
                : "Add a new lesson to your section"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="lessonTitle">Lesson Title *</Label>
                <Input
                  id="lessonTitle"
                  value={currentLesson?.title || ""}
                  onChange={(e) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Introduction to HTML"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lessonDescription">
                  Description (Optional)
                </Label>
                <Textarea
                  id="lessonDescription"
                  value={currentLesson?.description || ""}
                  onChange={(e) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      description: e.target.value,
                    })
                  }
                  placeholder="Briefly describe what this lesson covers"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lessonType">Content Type *</Label>
                <Select
                  value={currentLesson?.content_type}
                  onValueChange={(value) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      content_type: value as Lesson["content_type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="pdf">Pdf</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={currentLesson?.duration || ""}
                  onChange={(e) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      duration: e.target.value,
                    })
                  }
                  placeholder="e.g. 10:30"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the duration in format MM:SS (e.g. 10:30 for 10 minutes
                  and 30 seconds)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {currentLesson?.content_type === "video" && (
                <div className="border rounded-lg p-6">
                  <div className="text-lg font-medium mb-4">Video Upload</div>
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <div className="mx-auto mb-4 rounded-full bg-gray-100 p-3 w-fit">
                      <input
                        type="file"
                        className="h-6 w-6 text-muted-foreground"
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Télécharger une vidéo
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Vous pourrez télécharger votre vidéo après avoir créé le
                      cours
                    </p>
                    <Button disabled>Parcourir les fichiers</Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Formats supportés : MP4, MOV, AVI (Taille maximale : 2GB)
                    </p>
                  </div>
                </div>
              )}

              {currentLesson?.content_type === "pdf" && (
                <div className="border rounded-lg p-6">
                  <div className="text-lg font-medium mb-4">PDF Upload</div>
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <div className="mx-auto mb-4 rounded-full bg-gray-100 p-3 w-fit">
                      <input
                        type="file"
                        accept=".pdf"
                        className="h-6 w-6 text-muted-foreground"
                        onChange={handleFileSelect}
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Télécharger un PDF
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Vous pourrez télécharger votre PDF après avoir créé le cours
                    </p>
                    <Button disabled>Parcourir les fichiers</Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Format supporté : PDF (Taille maximale : 2GB)
                    </p>
                  </div>
                </div>
              )}

              {currentLesson?.content_type === "article" && (
                <div className="grid gap-2">
                  <Label htmlFor="articleContent">Article Content</Label>
                  <Textarea
                    id="articleContent"
                    value={currentLesson?.content_url || ""}
                    onChange={(e) =>
                      currentLesson &&
                      setCurrentLesson({
                        ...currentLesson,
                        content_url: e.target.value,
                      })
                    }
                    rows={12}
                    placeholder="Write your article content here..."
                  />
                </div>
              )}

              {currentLesson?.content_type === "quiz" && (
                <div className="text-center p-6 border rounded-lg">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Quiz Builder</h3>
                  <p className="text-muted-foreground mb-4">
                    You'll be able to create your quiz after the course is
                    created
                  </p>
                  <Button disabled>Open Quiz Builder</Button>
                </div>
              )}

              {currentLesson?.content_type === "assignment" && (
                <div className="grid gap-2">
                  <Label htmlFor="assignmentInstructions">
                    Assignment Instructions
                  </Label>
                  <Textarea
                    id="assignmentInstructions"
                    value={currentLesson?.content_url || ""}
                    onChange={(e) =>
                      currentLesson &&
                      setCurrentLesson({
                        ...currentLesson,
                        content_url: e.target.value,
                      })
                    }
                    rows={8}
                    placeholder="Provide detailed instructions for the assignment..."
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preview"
                  checked={currentLesson?.preview || false}
                  onCheckedChange={(checked) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      preview: !!checked,
                    })
                  }
                />
                <Label htmlFor="preview">
                  Make this lesson available as a free preview
                </Label>
              </div>

              <div className="border rounded-lg p-4 mt-4">
                <h3 className="font-medium mb-2">Resource Attachments</h3>

                {/* Display current attachments */}
                {currentLesson?.attachments &&
                currentLesson.attachments.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {currentLesson.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex items-center">
                          {attachment.type === "pdf" ? (
                            <File className="h-4 w-4 mr-2 text-red-500" />
                          ) : (
                            <FileText className="h-4 w-4 mr-2" />
                          )}
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({attachment.size})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => {
                            if (currentLesson) {
                              setCurrentLesson({
                                ...currentLesson,
                                attachments: currentLesson.attachments?.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    No attachments added yet
                  </p>
                )}

                {/* File upload section */}
                <div className="space-y-2">
                  <Label htmlFor="fileUpload">Add PDF or other resources</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    <Button
                      onClick={() =>
                        currentLesson && handleFileUpload(currentLesson.id)
                      }
                      disabled={!selectedFile || fileUploading}
                    >
                      {fileUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOC, XLSX, ZIP (Max size: 50MB)
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowLessonDialog(false);
                setCurrentLesson(null);
                setCurrentSection(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLesson}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {itemToDelete?.type === "section"
                ? "Are you sure you want to delete this section and all its lessons? This action cannot be undone."
                : "Are you sure you want to delete this lesson? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseCreationForm;
