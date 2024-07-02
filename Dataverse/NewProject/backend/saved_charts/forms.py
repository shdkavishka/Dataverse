from django import forms
from .models import SavedChart
import json

class SavedChartForm(forms.ModelForm):
    class Meta:
        model = SavedChart
        fields = ['chart_name', 'chart_data', 'chart_image']

def clean_chart_data(self):
        chart_data = self.cleaned_data.get('chart_data')
        # Validate chart data as needed
        try:
            chart_data_dict = json.loads(chart_data)
            if not isinstance(chart_data_dict, dict) or 'type' not in chart_data_dict or 'data' not in chart_data_dict:
                raise forms.ValidationError('Invalid chart data format')
        except json.JSONDecodeError:
            raise forms.ValidationError('Invalid JSON format for chart data')
        return chart_data