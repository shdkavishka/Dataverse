from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
from .models import SavedChart
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
import json
import traceback

def home(request):
    return HttpResponse("Welcome to the homepage")

@csrf_exempt
@require_http_methods(["POST"])
def execute_query(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            query = data.get('query')
            if not query:
                return JsonResponse({'error': 'Query parameter is missing'}, status=400)
            
            with connection.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                data = [dict(zip(columns, row)) for row in rows]
            
             # Ensure data is consistent with label and value keys
            for row in data:
                row['_label'] = row[columns[0]]  
                row['_value'] = row[columns[1]] # Use underscore to avoid sending it to the frontend 

            return JsonResponse(data, safe=False)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

   
@csrf_exempt
@require_http_methods(["POST"])
def save_chart(request):
   if request.method == 'POST':
        try:
        # Parse JSON data from request body
            data = json.loads(request.body.decode('utf-8'))
            chart_name = data.get('chartName')
            chart_data = data.get('chartData')
            created_by_username= data.get('createdBy')

            #if not all([chart_name, chart_data, created_by_username]):
             #return JsonResponse({'error': 'Missing required fields'}, status=400)
            
             # Assuming `created_by` is the username and finding the user instance
            try:
                user = User.objects.get(username=created_by_username)
            except User.DoesNotExist:
               return JsonResponse({'error': 'User not found'}, status=404)
            
             
       # Create and save the chart object
            chart = SavedChart(chart_name=chart_name, chart_data=chart_data, created_by=user)
            chart.save(using='saved_charts')

            return JsonResponse({'message': 'Chart saved successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_saved_charts(request):
    try:
        _= request

        # Retrieve all saved charts
        charts = SavedChart.objects.using('saved_charts').all().values('id', 'chart_name', 'chart_data', 'created_by', 'created_at')

        return JsonResponse(list(charts), safe=False)
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_chart(request, chart_id):
    try:
        chart = get_object_or_404(SavedChart.objects.using('saved_charts'), id=chart_id)
        chart.delete()
        return JsonResponse({'message': 'Chart deleted successfully'})
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
