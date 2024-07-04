from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeedbackViewSet  # Adjusted import to FeedbackViewSet

router = DefaultRouter()
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
