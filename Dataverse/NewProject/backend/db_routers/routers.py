class SavedChartsRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'saved_charts':
            return 'saved_charts'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'saved_charts':
            return 'saved_charts'
        return None
    
    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the saved_charts app is involved.
        """
        if obj1._meta.app_label == 'saved_charts' or obj2._meta.app_label == 'saved_charts':
            return True
        return None
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'saved_charts':
            return db == 'saved_charts'
        return None
