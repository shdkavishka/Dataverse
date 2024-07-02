
from django.urls import path
from .views import generate_sql_query, delete_chat,save_chat,view_chat

urlpatterns = [
    path('generate_sql_query/', generate_sql_query),
    path('save_chat/', save_chat),
     path('delete_chat/<int:chat_id>/',delete_chat),
     path('chat/<int:chat_id>/',view_chat)

]

