from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
from .models import SavedChart
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
import json
import traceback
import pymysql

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from sqlalchemy import create_engine, text
import json
import traceback
@csrf_exempt
@require_http_methods(["POST"])
def execute_query(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            query = data.get('query')
            db_details = data.get('db_details')

            if not query:
                return JsonResponse({'error': 'Query parameter is missing'}, status=400)
            if not db_details:
                return JsonResponse({'error': 'Database details are missing'}, status=400)

            # Extract database details from request
            db_name = db_details.get('db_name')
            db_user = db_details.get('db_user')
            db_password = db_details.get('db_password')
            db_host = db_details.get('db_host')

            if not all([db_name, db_user, db_password, db_host]):
                return JsonResponse({'error': 'Incomplete database details'}, status=400)

            # Connect to the MySQL database
            connection = pymysql.connect(
                host=db_host,
                user=db_user,
                password=db_password,
                database=db_name,
                cursorclass=pymysql.cursors.DictCursor  # Return results as dictionaries
            )

            with connection.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()

                # Ensure data is consistent with label and value keys
                for row in rows:
                    row['_label'] = row[list(row.keys())[0]]
                    row['_value'] = row[list(row.keys())[1]]

            return JsonResponse(rows, safe=False)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
        finally:
            if connection:
                connection.close()


   
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
