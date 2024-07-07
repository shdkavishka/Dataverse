from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
from .models import SavedChart
from django.shortcuts import get_object_or_404
from users.models import User
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


   
import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import SavedChart, User, ConnectedDatabase

@csrf_exempt
@require_http_methods(["POST"])
def save_chart(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from request body
            data = json.loads(request.body.decode('utf-8'))
            chart_name = data.get('chartName')
            chart_data = data.get('chartData')
            created_by_id = data.get('createdBy')
            database_id = data.get('database_id')

            try:
                user = User.objects.get(id=created_by_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            try:
                database = ConnectedDatabase.objects.get(id=database_id)
            except ConnectedDatabase.DoesNotExist:
                return JsonResponse({'error': 'Database not found'}, status=404)

            # Create and save the chart object
            chart = SavedChart(chart_name=chart_name, chart_data=chart_data, created_by=user, database=database)
            chart.save()

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
        chart = get_object_or_404(SavedChart, id=chart_id)
        chart.delete()
        return JsonResponse({'message': 'Chart deleted successfully'})
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import SavedChart, User, ConnectedDatabase



@csrf_exempt
@require_http_methods(["GET"])
def get_charts_by_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        charts = SavedChart.objects.filter(created_by=user)
        chart_list = list(charts.values('id', 'chart_name', 'chart_data', 'created_at', 'updated_at', 'database_id'))

        return JsonResponse({'charts': chart_list}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_charts_by_database(request, database_id):
    try:
        database = ConnectedDatabase.objects.get(id=database_id)
        charts = SavedChart.objects.filter(database=database)
        chart_list = list(charts.values('id', 'chart_name', 'chart_data', 'created_at', 'updated_at', 'created_by_id'))

        return JsonResponse({'charts': chart_list}, status=200)
    except ConnectedDatabase.DoesNotExist:
        return JsonResponse({'error': 'Database not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
