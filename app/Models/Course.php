<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'price',
        'user_id',
        'category_id',
        'thumbnail',
        'status',
        'level',
        'language',
        'duration',
    ];

    /**
     * Get the user that owns the course.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that owns the course.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the sections for the course.
     */
    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    /**
     * Get the enrollments for the course.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the tags for the course.
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'tag_course');
    }

    /**
     * Get the resources for the course.
     */
    public function resources()
    {
        return $this->hasMany(CourseResource::class);
    }
}