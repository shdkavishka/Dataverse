from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Feedback
from .serializers import FeedbackSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    @action(detail=False, methods=['post'])
    def add_feedback_or_reaction(self, request):
        question = request.data.get('question')
        answer_query = request.data.get('answer')
        reaction = request.data.get('reaction', '')
        feedback = request.data.get('feedback', '')
        chart_image = request.data.get('chartData', '')

        feedback_instance, created = Feedback.objects.get_or_create(
            question=question, answer_query=answer_query,
            defaults={'reaction': reaction, 'feedback': feedback, 'chart_image': chart_image}
        )

        if not created:
            if reaction:
                feedback_instance.reaction = reaction
            if feedback:
                feedback_instance.feedback = feedback
            if chart_image:
                feedback_instance.chart_image = chart_image
            feedback_instance.save()

        serializer = self.get_serializer(feedback_instance)
        return Response(serializer.data)
