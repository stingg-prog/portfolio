from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.portfolio_view, name='portfolio'),
    path('contact/', views.contact_form_view, name='contact_form'),
]
