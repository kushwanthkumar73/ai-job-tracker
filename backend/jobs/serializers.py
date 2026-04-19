from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id',
            'company_name',
            'role',
            'job_description',
            'required_skills',
            'salary_range',
            'location',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']