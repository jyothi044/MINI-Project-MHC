from rest_framework import serializers
from .models import Post, Comment, Like
from django.contrib.auth import get_user_model
from django.core.files.images import get_image_dimensions

User = get_user_model()

class PostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'image', 'created_at', 'updated_at']

    def validate_image(self, value):
        if value:
            # Check file size (limit: 5MB)
            max_size = 5 * 1024 * 1024  # 5MB
            if value.size > max_size:
                raise serializers.ValidationError("Image file too large ( > 5 MB )")

            # Validate file type safely
            allowed_types = ['image/jpeg', 'image/png', 'image/gif']
            content_type = getattr(value.file, 'content_type', None)  # Safe access
            if content_type and content_type not in allowed_types:
                raise serializers.ValidationError("Unsupported image format. Use JPEG, PNG, or GIF.")

            # Check image dimensions
            width, height = get_image_dimensions(value)
            if width > 4096 or height > 4096:
                raise serializers.ValidationError("Image dimensions too large (max 4096x4096)")

        return value

    def create(self, validated_data):
        request = self.context.get('request')  # Get the request context
        if request and hasattr(request, "user"):
            validated_data["author"] = request.user  # Set the author from request
        return super().create(validated_data)


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at', 'updated_at', 'parent_comment']


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'created_at']
