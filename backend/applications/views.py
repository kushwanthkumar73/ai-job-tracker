from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Application
from .serializers import ApplicationSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def application_list(request):
    if request.method == 'GET':
        applications = Application.objects.filter(
            user=request.user
        ).order_by('-applied_date')
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def application_detail(request, pk):
    try:
        application = Application.objects.get(pk=pk, user=request.user)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)

    if request.method == 'PATCH':
        serializer = ApplicationSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        application.delete()
        return Response({'message': 'Application deleted'}, status=status.HTTP_204_NO_CONTENT)