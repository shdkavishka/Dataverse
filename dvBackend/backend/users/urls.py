from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView,ResetPassword,ResetPasswordConfirm,EditProfileView,DeleteAccountView,ResetPasswordConfirm2

from .views import SaveGoogleUserView,GoogleLoginView,DeleteGoogleUserAccountView




urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('edit_profile/', EditProfileView.as_view()),
    path('reset_password/', ResetPassword.as_view()),
    path('reset_password_confirm/<str:uidb64>/<str:token>/', ResetPasswordConfirm.as_view(), name='reset_password_confirm'),
    path('reset_password_confirm/', ResetPasswordConfirm2.as_view()),
    path('delete-account', DeleteAccountView.as_view()),

    #AH-- for google auth
    path('save_google_user', SaveGoogleUserView.as_view()),
    path('google_login', GoogleLoginView.as_view()),
    path('google_delete', DeleteGoogleUserAccountView.as_view()),

]

