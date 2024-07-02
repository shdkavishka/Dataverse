from django.urls import path
from . import views

urlpatterns = [
    path('view-saved-charts/', views.view_saved_charts, name='view_saved_charts'),
    path('save-chart/', views.save_chart, name='save_chart'),
    path('get-saved-charts/', views.get_saved_charts, name='get_saved_charts'),
    
 
]

