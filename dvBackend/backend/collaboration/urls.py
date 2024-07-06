# urls.py

from django.urls import path
from .views import InviteCollaboratorView, ConfirmCollaborationView,UserCollaborationsView,DatabaseCollaboratorsView,DatabaseDetailView

urlpatterns = [
    path('invite/', InviteCollaboratorView.as_view(), name='invite-collaborator'),
    path('confirm-collaboration/', ConfirmCollaborationView.as_view(), name='confirm-collaboration'),
    path('database-collabs/', UserCollaborationsView.as_view(), name='confirm-collaboration'),
    path('users-collabs/', DatabaseCollaboratorsView.as_view(), name='confirm-collaboration'),
    path('view-database/<int:pk>/', DatabaseDetailView.as_view(), name='database-detail'),

]
