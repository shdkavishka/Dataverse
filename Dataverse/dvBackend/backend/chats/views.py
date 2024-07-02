from django.shortcuts import render
from .models import Chat, Message
from rest_framework.decorators import api_view
from rest_framework.response import Response
from langchain.chains import create_sql_query_chain
from langchain_openai import ChatOpenAI
from langchain_community.utilities.sql_database import SQLDatabase
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool
from .serializers import SQLQuerySerializer,ChatSerializer,MessageSerializer
from rest_framework import status
from rest_framework.response import Response




@api_view(['POST'])
def generate_sql_query(request):
    serializer = SQLQuerySerializer(data=request.data)
    if serializer.is_valid():
        db_user = serializer.validated_data['db_user']
        db_password = serializer.validated_data['db_password']
        db_host = serializer.validated_data['db_host']
        db_name = serializer.validated_data['db_name']
        prompt = serializer.validated_data['prompt']
        openai_api_key = ""
        

        # NSN - Create the database connection
        db = SQLDatabase.from_uri(f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}")
        
        # NSN - Create the language model
        llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0, openai_api_key=openai_api_key)

        # NSN - Generate the query
        generate_query_chain = create_sql_query_chain(llm, db)
        query = generate_query_chain.invoke({"question": prompt})

        # NSN - Execute the query
        execute_query_tool = QuerySQLDataBaseTool(db=db)
        result = execute_query_tool.invoke(query)

        return Response({
            "query": query,
            "result": result
        })
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def save_chat(request):
    chat_serializer = ChatSerializer(data=request.data)
    if chat_serializer.is_valid():
        chat_instance = chat_serializer.save()  # NSN - Save the chat instance

        messages_data = request.data.get('messages', [])
        for message_data in messages_data:
            message_data['chat'] = chat_instance.id  # NSN - Assign chat instance ID to each message data

        # NSN - Create messages for the chat
        message_serializer = MessageSerializer(data=messages_data, many=True)
        if message_serializer.is_valid():
            message_serializer.save()  # NSN - Save messages associated with the chat instance
        else:
            # NSN - Handle serializer validation errors
            return Response(message_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # NSN - Return serialized chat instance with messages
        return Response(chat_serializer.data, status=status.HTTP_201_CREATED)
    
    # NSN - Handle chat serializer validation errors
    return Response(chat_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# NSN - To delete chats
@api_view(['DELETE'])
def delete_chat(request, chat_id):
    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return Response({"error": "Chat not found"}, status=status.HTTP_404_NOT_FOUND)

    chat.messages.all().delete()

    chat.delete()

    return Response({"message": "Chat and associated messages deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# NSN - To view chats
@api_view(['GET'])
def view_chat(request, chat_id):
    try:
        chat = Chat.objects.prefetch_related('messages').get(pk=chat_id)
    except Chat.DoesNotExist:
        return Response({"error": "Chat not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ChatSerializer(chat)
    return Response(serializer.data)