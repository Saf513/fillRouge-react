import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lesson } from '../../types/course';

interface LessonViewerProps {
  lesson: Lesson;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">{lesson.title}</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {lesson.video_url ? (
          <div className="aspect-video w-full max-w-4xl mx-auto mb-6">
            <iframe
              src={lesson.video_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md mb-6">
            <p className="text-gray-500">Aucune vidéo disponible</p>
          </div>
        )}

        {lesson.description && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700">{lesson.description}</p>
          </div>
        )}

        {lesson.content && (
          <div>
            <h3 className="text-lg font-medium mb-2">Contenu</h3>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`flex items-center px-4 py-2 rounded-md ${
            hasPrevious
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Précédent
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`flex items-center px-4 py-2 rounded-md ${
            hasNext
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Suivant
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default LessonViewer; 