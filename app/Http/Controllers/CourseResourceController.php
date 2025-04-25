<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseResource;
use App\Http\Requests\CourseResourceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CourseResourceController extends Controller
{
    /**
     * Store multiple resources for a course.
     *
     * @param  \App\Http\Requests\CourseResourceRequest  $request
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function store(CourseResourceRequest $request, Course $course)
    {
        $resources = [];

        foreach ($request->resourceAttachments as $attachment) {
            $resourceData = [
                'title' => $attachment['title'],
                'type' => $attachment['type'],
                'is_downloadable' => $attachment['is_downloadable'] ?? true,
            ];

            // Handle file upload or URL based on type
            if (in_array($attachment['type'], ['PDF', 'DOCUMENT', 'VIDEO', 'AUDIO'])) {
                if (isset($attachment['file'])) {
                    $file = $attachment['file'];
                    $resourceData['file_url'] = $file->store('course_resources', 'public');
                    $resourceData['file_size'] = $file->getSize();
                }
            } else if ($attachment['type'] === 'LINK') {
                $resourceData['file_url'] = $attachment['file_url'];
            }

            $resource = $course->resources()->create($resourceData);
            $resources[] = $resource;
        }

        return response()->json([
            'message' => 'Ressources ajoutées avec succès',
            'resources' => $resources
        ], 201);
    }

    /**
     * Update a course resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Course  $course
     * @param  \App\Models\CourseResource  $resource
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Course $course, CourseResource $resource)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:PDF,DOCUMENT,VIDEO,AUDIO,LINK',
            'file' => 'nullable|file|max:102400',
            'file_url' => 'required_if:type,LINK|nullable|url',
            'is_downloadable' => 'boolean'
        ]);

        if ($request->hasFile('file')) {
            if ($resource->file_url) {
                Storage::disk('public')->delete($resource->file_url);
            }
            $file = $request->file('file');
            $validated['file_url'] = $file->store('course_resources', 'public');
            $validated['file_size'] = $file->getSize();
        }

        $resource->update($validated);

        return response()->json([
            'message' => 'Ressource mise à jour avec succès',
            'resource' => $resource
        ]);
    }

    /**
     * Remove a course resource.
     *
     * @param  \App\Models\Course  $course
     * @param  \App\Models\CourseResource  $resource
     * @return \Illuminate\Http\Response
     */
    public function destroy(Course $course, CourseResource $resource)
    {
        $this->authorize('update', $course);

        if ($resource->file_url && !filter_var($resource->file_url, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($resource->file_url);
        }

        $resource->delete();

        return response()->json([
            'message' => 'Ressource supprimée avec succès'
        ]);
    }

    /**
     * Download a course resource.
     *
     * @param  \App\Models\Course  $course
     * @param  \App\Models\CourseResource  $resource
     * @return \Illuminate\Http\Response
     */
    public function download(Course $course, CourseResource $resource)
    {
        $this->authorize('view', $course);

        if (!$resource->is_downloadable) {
            return response()->json([
                'message' => 'Cette ressource n\'est pas téléchargeable.'
            ], 403);
        }

        if (filter_var($resource->file_url, FILTER_VALIDATE_URL)) {
            return redirect($resource->file_url);
        }

        return Storage::disk('public')->download($resource->file_url);
    }
}