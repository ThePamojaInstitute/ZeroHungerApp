from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from .models import BoardPost
from .serializers import createPostSerializer

class createPost(APIView):
    def post(self, request, format=JSONParser):
        serializer = createPostSerializer(data=request.data)
        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
              return Response(serializer.errors, status=401)
        
class deletePost(APIView):
     def post(self,request, format=JSONParser):
          print("delete post test")
          return Response("Reached delete post in API", status=201)
