from django.db import models


class ConnectedDatabase(models.Model):
    name = models.CharField(max_length=100)
    server = models.CharField(max_length=100)
    database = models.CharField(max_length=100)
    user = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

#   This method returns a string representation of the database connection object.
#   It returns the name of the database.
    def __str__(self):
        return self.name

#   This method returns a dictionary containing the credentials
#   required to connect to the database server.
    def get_credentials(self):
        return {
            'server': self.server,
            'database': self.database,
            'user': self.user,
            'password': self.password
        }       



class DataAnalysisResult(models.Model):
    connected_database = models.ForeignKey(ConnectedDatabase, on_delete=models.CASCADE)
    # Add fields for analysis results
    result = models.JSONField()

    def __str__(self):
        return f"Analysis Result for {self.connected_database}"