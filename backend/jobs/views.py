import os
import os
import json
from groq import Groq
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def job_list(request):
    if request.method == 'GET':
        jobs = Job.objects.filter(user=request.user).order_by('-created_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_detail(request, pk):
    try:
        job = Job.objects.get(pk=pk, user=request.user)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = JobSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        job.delete()
        return Response({'message': 'Job deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def parse_job_description(request):
    jd_text = request.data.get('job_description', '')
    if not jd_text:
        return Response({'error': 'Job description required'}, status=status.HTTP_400_BAD_REQUEST)

    prompt = f"""Analyze this job description and extract information.
Return ONLY valid JSON, no explanation, no markdown, no backticks:
{{
    "skills": ["skill1", "skill2"],
    "salary": "X-Y LPA or Not mentioned",
    "experience": "X years or Not mentioned",
    "company": "Company Name or Not mentioned",
    "role": "Job Title"
}}

Job Description:
{jd_text}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
    )

    ai_text = response.choices[0].message.content.strip()
    if ai_text.startswith('```'):
        ai_text = ai_text.split('```')[1]
        if ai_text.startswith('json'):
            ai_text = ai_text[4:]
    parsed_data = json.loads(ai_text.strip())
    return Response({'success': True, 'data': parsed_data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def match_resume(request):
    job_description = request.data.get('job_description', '')
    resume_text = request.data.get('resume_text', '')

    if not job_description or not resume_text:
        return Response({'error': 'Both job description and resume text required'}, status=status.HTTP_400_BAD_REQUEST)

    prompt = f"""Compare this resume with the job description and give a match score.
Return ONLY valid JSON, no explanation, no markdown, no backticks:
{{
    "match_score": 75,
    "matching_skills": ["skill1", "skill2"],
    "missing_skills": ["skill3", "skill4"],
    "recommendation": "Short recommendation here"
}}

Job Description:
{job_description}

Resume:
{resume_text}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
    )

    ai_text = response.choices[0].message.content.strip()
    if ai_text.startswith('```'):
        ai_text = ai_text.split('```')[1]
        if ai_text.startswith('json'):
            ai_text = ai_text[4:]
    parsed_data = json.loads(ai_text.strip())
    return Response({'success': True, 'data': parsed_data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_cover_letter(request):
    job_description = request.data.get('job_description', '')
    resume_text = request.data.get('resume_text', '')
    company_name = request.data.get('company_name', '')
    role = request.data.get('role', '')

    if not job_description or not resume_text:
        return Response({'error': 'Job description and resume text required'}, status=status.HTTP_400_BAD_REQUEST)

    prompt = f"""Write a professional cover letter for this job application.

Company: {company_name}
Role: {role}
Job Description: {job_description}
My Resume: {resume_text}

Write a compelling, personalized cover letter in 3 paragraphs. Be specific and professional."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )

    cover_letter = response.choices[0].message.content
    return Response({'success': True, 'cover_letter': cover_letter})