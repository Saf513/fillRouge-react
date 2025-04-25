<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseResource extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'course_id',
        'title',
        'type',
        'file_url',
        'file_size',
        'is_downloadable',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_downloadable' => 'boolean',
        'file_size' => 'integer',
    ];

    /**
     * Get the course that owns the resource.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}