# data_analysis/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('connected-databases/', views.ConnectedDatabaseListCreate.as_view(), name='connected-databases'),
]
