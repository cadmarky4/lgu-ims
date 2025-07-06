<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Complaint extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'base_ticket_id',
        'c_category',
        'department',
        'location',
    ];

    const CATEGORIES = [
        'PUBLIC_SERVICES',
        'INFRASTRUCTURE',
        'SOCIAL_WELFARE',
        'PUBLIC_SAFETY',
        'HEALTH_SERVICES',
        'ENVIRONMENTAL',
        'EDUCATION',
        'BUSINESS_PERMITS',
        'COMMUNITY_PROGRAMS',
        'OTHERS'
    ];

    const DEPARTMENTS = [
        'ADMINISTRATION',
        'HEALTH_SERVICES',
        'SOCIAL_SERVICES',
        'SECURITY_PUBLIC_SAFETY',
        'FINANCE_TREASURY',
        'RECORDS_MANAGEMENT',
        'COMMUNITY_DEVELOPMENT',
        'DISASTER_RISK_REDUCTION',
        'ENVIRONMENTAL_MANAGEMENT',
        'YOUTH_SPORTS_DEVELOPMENT',
        'SENIOR_CITIZEN_AFFAIRS',
        'WOMENS_AFFAIRS',
        'BUSINESS_PERMITS',
        'INFRASTRUCTURE_DEVELOPMENT'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'base_ticket_id');
    }
}