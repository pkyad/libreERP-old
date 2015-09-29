from django.conf.urls import include, url
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users' , views.UserViewSet)
router.register(r'groups' , views.GroupViewSet)
router.register(r'leaveApplications' , views.LeaveApplicationViewSet)
router.register(r'myLeave' , views.selfSerializerLeaveManagementViewSet, base_name = 'myLeave')
router.register(r'userDesignation' , views.userDesignationViewSet)
router.register(r'notification' , views.notificationViewSet, base_name = 'notification')

urlpatterns = [
    url(r'^', include(router.urls)),
]
