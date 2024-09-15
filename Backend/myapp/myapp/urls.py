"""
URL configuration for myapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from horizonx.views import login , signup, get_all_properties_by_search,get_all_properties_by_filters,get_all_properties_by_username,delete_property,get_property_by_id,update_property,upload_property
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login),
    path('api/signup/', signup),
    path('api/getAllProperties/search/<str:search_term>/', get_all_properties_by_search),
    path('api/getAllProperties/filters/', get_all_properties_by_filters),
    path('api/allProperties/<str:username>/',get_all_properties_by_username),
    path('api/property/<str:propertyId>/', get_property_by_id, name='get_property_by_id'),
    path('api/deleteProperty/<str:propertyId>/',delete_property),
    path('api/updateProperty/<str:propertyId>/',update_property),
    path('api/newProperty/',upload_property)
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
