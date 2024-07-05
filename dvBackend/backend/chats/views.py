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
    chat_id = request.data.get('chat_id')
    chat_instance = None

    if chat_id:
        try:
            chat_instance = Chat.objects.get(id=chat_id) 
            chat_serializer = ChatSerializer(chat_instance, data=request.data, partial=True)
            if chat_serializer.is_valid():
                chat_instance = chat_serializer.save()  # NSN - Save the updated chat instance
            else:
                return Response(chat_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Chat.DoesNotExist:
            return Response({"error": "Chat instance not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        chat_serializer = ChatSerializer(data=request.data)
        if chat_serializer.is_valid():
            chat_instance = chat_serializer.save()
        else:
            return Response(chat_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    messages_data = request.data.get('messages', [])
    for message_data in messages_data:
        message_data['chat'] = chat_instance.id

    message_serializer = MessageSerializer(data=messages_data, many=True)
    if message_serializer.is_valid():
        message_serializer.save()
    else:
        return Response(message_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response(ChatSerializer(chat_instance).data, status=status.HTTP_201_CREATED)





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



@api_view(['POST'])
def get_past_chats(request):
    try:
        id = request.data.get('id')
        if id is None:
            return Response({'error': 'datavaseid is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        chats = Chat.objects.filter(database=id).values('id', 'title')
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)
    
    except Chat.DoesNotExist:
        return Response({'error': 'Chats not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def add_messages_to_chat(request):
    chat_id = request.data.get('chat_id')
    
    if not chat_id:
        return Response({"error": "Chat ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        chat_instance = Chat.objects.get(id=chat_id)
    except Chat.DoesNotExist:
        return Response({"error": "Chat instance not found"}, status=status.HTTP_404_NOT_FOUND)

    messages_data = request.data.get('messages', [])
    if not messages_data:
        return Response({"error": "Messages data is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    for message_data in messages_data:
        message_data['chat'] = chat_instance.id

    message_serializer = MessageSerializer(data=messages_data, many=True)
    if message_serializer.is_valid():
        message_serializer.save()
        return Response(ChatSerializer(chat_instance).data, status=status.HTTP_200_OK)
    else:
        return Response(message_serializer.errors, status=status.HTTP_400_BAD_REQUEST)