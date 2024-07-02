from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
from .models import ConnectedDatabase
from .serializers import ConnectedDatabaseSerializer
from django.http import JsonResponse
import pyodbc


# View for creating and listing connected databases
class ConnectedDatabaseListCreate(ListCreateAPIView):
    queryset = ConnectedDatabase.objects.all()
    serializer_class = ConnectedDatabaseSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # Extract database connection details
        name = validated_data.get('name')
        server = validated_data.get('server')
        database = validated_data.get('database')
        user = validated_data.get('user')
        password = validated_data.get('password')

        # # Check if database name already exists
        # if ConnectedDatabase.objects.filter(name=name).exists():
        #     return Response({'message': 'Database name already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to connect to the database
        try:
            conn = pyodbc.connect(
                f'DRIVER=ODBC Driver 17 for SQL Server;'
                f'SERVER={server};'
                f'DATABASE={database};'
                f'UID={user};'
                f'PWD={password};'
            )
            conn.close()
            
            # Create and save a new ConnectedDatabase instance
            connected_database = ConnectedDatabase.objects.create(
                name=name,
                server=server,
                database=database,
                user=user,
                password=password
            )
            return Response({'message': 'Database connection successful', 'id': connected_database.id}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
# View for getting tables from a user database  
def get_user_database_tables(request, user_database_id):
    try:
        user_database = ConnectedDatabase.objects.get(pk=user_database_id)
        user_database_credentials = user_database.get_credentials()
        tables = get_tables_from_user_database(user_database_credentials)
        return JsonResponse({'tables': tables})
    except ConnectedDatabase.DoesNotExist:
        return JsonResponse({'error': 'User database not found'}, status=404)

# Function to get tables from a user database
def get_tables_from_user_database(user_database_credentials):
    try:
        conn_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + user_database_credentials['server'] + \
                   ';DATABASE=' + user_database_credentials['database'] + \
                   ';UID=' + user_database_credentials['user'] + \
                   ';PWD=' + user_database_credentials['password']
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        print("Connected to user's SQL Server database successfully") 
        cursor.execute("SELECT name FROM sys.tables;")
        table_names = cursor.fetchall()
        cursor.close()
        conn.close()
        print("hello from tables",table_names)
        return [table[0] for table in table_names]
    except pyodbc.Error as e:
        print("Error connecting to or querying user's SQL Server database:", e)
        return []
    


def table_data_analysis(request, user_database_id, table_name, plot_type):
    try:
        # Assuming ConnectedDatabase and get_credentials are properly defined
        user_database = ConnectedDatabase.objects.get(pk=user_database_id)
        user_database_credentials = user_database.get_credentials()

        # Establish connection to user's database
        conn_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + user_database_credentials['server'] + \
                   ';DATABASE=' + user_database_credentials['database'] + \
                   ';UID=' + user_database_credentials['user'] + \
                   ';PWD=' + user_database_credentials['password']
        conn = pyodbc.connect(conn_str)

        # Fetch data from the specified table
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM " + table_name)
        data = cursor.fetchall()

        # Get column names
        columns = [column.column_name for column in cursor.columns(table=table_name)]

        # Close database connection
        cursor.close()
        conn.close()

        # Convert data to a list of dictionaries
        rows = [dict(zip(columns, row)) for row in data]

        # Return the data and plot type as JSON response
        return JsonResponse({'data': rows, 'plot_type': plot_type})
    except pyodbc.Error as e:
        print("Error connecting to or querying user's SQL Server database:", e)
        return JsonResponse({'error': str(e)}, status=500)
    except ConnectedDatabase.DoesNotExist:
        return JsonResponse({'error': 'User database not found'}, status=404)
