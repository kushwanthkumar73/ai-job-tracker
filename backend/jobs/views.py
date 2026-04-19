from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer

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