from django.urls import path
from . import views

urlpatterns = [
    path('', views.job_list, name='job_list'),
    path('<int:pk>/', views.job_detail, name='job_detail'),
    path('parse-jd/', views.parse_job_description, name='parse_jd'),
    path('match-resume/', views.match_resume, name='match_resume'),
    path('cover-letter/', views.generate_cover_letter, name='cover_letter'),
]