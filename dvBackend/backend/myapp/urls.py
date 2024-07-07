# myapp/urls.py


from django.urls import path
from . import views

urlpatterns = [
    path('query', views.execute_query, name='execute_query'),
    path('save-chart', views.save_chart, name='save_chart'),
    path('get_saved-charts', views.get_saved_charts, name='get_saved_charts'),
    path('delete-chart/<int:chart_id>/', views.delete_chart, name='delete-chart'),
    path('charts/user/<int:user_id>/', views.get_charts_by_user, name='get_charts_by_user'),
    path('charts/database/<int:database_id>/', views.get_charts_by_database, name='get_charts_by_database'),
    ]
