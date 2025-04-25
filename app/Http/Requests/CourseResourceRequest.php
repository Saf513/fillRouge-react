<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseResourceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Check if the user is a teacher and owns the course
        return $this->user() && $this->user()->hasRole('teacher') && 
               ($this->route('course') ? $this->route('course')->user_id === $this->user()->id : true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'resourceAttachments' => 'required|array',
            'resourceAttachments.*.title' => 'required|string|max:255',
            'resourceAttachments.*.type' => 'required|string|in:PDF,DOCUMENT,VIDEO,AUDIO,LINK',
            'resourceAttachments.*.file' => 'required_if:resourceAttachments.*.type,PDF,DOCUMENT,VIDEO,AUDIO|nullable|file|max:102400',
            'resourceAttachments.*.file_url' => 'required_if:resourceAttachments.*.type,LINK|nullable|url',
            'resourceAttachments.*.is_downloadable' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'resourceAttachments.required' => 'Vous devez ajouter au moins une pièce jointe.',
            'resourceAttachments.*.title.required' => 'Le titre de la pièce jointe est obligatoire.',
            'resourceAttachments.*.type.required' => 'Le type de la pièce jointe est obligatoire.',
            'resourceAttachments.*.type.in' => 'Le type de la pièce jointe doit être PDF, DOCUMENT, VIDEO, AUDIO ou LINK.',
            'resourceAttachments.*.file.required_if' => 'Le fichier est obligatoire pour ce type de pièce jointe.',
            'resourceAttachments.*.file.max' => 'Le fichier ne doit pas dépasser 100 Mo.',
            'resourceAttachments.*.file_url.required_if' => 'L\'URL est obligatoire pour les pièces jointes de type LINK.',
            'resourceAttachments.*.file_url.url' => 'L\'URL doit être valide.',
        ];
    }
}