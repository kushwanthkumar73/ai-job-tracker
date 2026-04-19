from django.db import models
from users.models import User
from jobs.models import Job

class Application(models.Model):
    STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('Interview', 'Interview'),
        ('Offer', 'Offer'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Applied')
    match_score = models.IntegerField(null=True, blank=True)
    cover_letter = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    applied_date = models.DateField(auto_now_add=True)
    follow_up_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.job.role} at {self.job.company_name}"