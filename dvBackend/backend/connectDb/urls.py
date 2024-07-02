# data_analysis/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('connected-databases/', views.ConnectedDatabaseListCreate.as_view(), name='connected-databases'),
    path('user-databases/<int:user_database_id>/tables/', views.get_user_database_tables, name='get_user_database_tables'),
    path('user-tables/<int:user_database_id>/tables/<str:table_name>/<str:plot_type>/', views.table_data_analysis, name='table_data_analysis'),
]
