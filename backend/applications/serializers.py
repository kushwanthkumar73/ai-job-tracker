from rest_framework import serializers
from .models import Application
from jobs.serializers import JobSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_details',
            'status',
            'match_score',
            'cover_letter',
            'notes',
            'applied_date',
            'follow_up_date',
        ]
        read_only_fields = ['id', 'applied_date']