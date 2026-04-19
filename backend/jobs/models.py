from django.db import models
from users.models import User

class Job(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    company_name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    job_description = models.TextField(null=True, blank=True)
    required_skills = models.JSONField(default=list)
    salary_range = models.CharField(max_length=100, null=True, blank=True)
    location = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} at {self.company_name}"