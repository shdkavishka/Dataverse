from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from .models import SavedChart
from .forms import SavedChartForm

@require_http_methods(["GET"])
def get_saved_charts(request):
    try:
        # Retrieve all saved charts
        charts = SavedChart.objects.using('saved_charts').all()
        
        # Prepare the data to be returned
        charts_data = []
        for chart in charts:
            chart_data = {
                'id': chart.id,
                'chart_name': chart.chart_name,
                'chart_data': chart.chart_data,
                'chart_image': chart.chart_image.url if chart.chart_image else None,
                'created_by': chart.created_by.username,  # Get the username of the creator
                'created_at': chart.created_at.strftime("%Y-%m-%d %H:%M:%S"),  # Format datetime
            }
            charts_data.append(chart_data)
        
        return JsonResponse(charts_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@login_required
def save_chart(request):
    if request.method == 'POST':
        form = SavedChartForm(request.POST, request.FILES)
        if form.is_valid():
            saved_chart = form.save(commit=False)
            saved_chart.created_by = request.user
            saved_chart.save(using='saved_charts')
            return redirect('view_saved_charts')
    else:
        form = SavedChartForm()
    return render(request, 'saved_charts/save_chart.html', {'form': form})   

def view_saved_charts(request):
    charts = SavedChart.objects.using('saved_charts').all()
    return render(request, 'saved_charts/view_saved_charts.html', {'charts': charts})


