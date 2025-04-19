from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import PostViewSet, CommentViewSet

# Main Router
router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

# Nested Router for Comments
nested_router = NestedDefaultRouter(router, r'posts', lookup='post')
nested_router.register(r'comments', CommentViewSet, basename='post-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(nested_router.urls)),
]
