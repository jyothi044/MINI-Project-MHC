from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing posts.
    """
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        logger.info(f"User {request.user.id} is creating a post")
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            logger.error(f"Validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.perform_create(serializer)
            logger.info(f"Post created successfully by user {request.user.id}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating post: {str(e)}")
            return Response({"error": "Post creation failed"}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        logger.info(f"Creating post for user {self.request.user}")
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        logger.info(f"User {request.user.id} is updating post {kwargs.get('pk')}")
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['POST'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """
        Like a post.
        """
        post = self.get_object()
        user = request.user

        logger.info(f"User {user.id} attempting to like post {post.id}")

        like, created = Like.objects.get_or_create(post=post, user=user)
        if not created:
            logger.warning(f"User {user.id} already liked post {post.id}")
            return Response({"error": "You already liked this post."}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"User {user.id} successfully liked post {post.id}")
        return Response({"message": "Post liked successfully"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['POST'], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request, pk=None):
        """
        Unlike a post.
        """
        post = self.get_object()
        user = request.user

        logger.info(f"User {user.id} attempting to unlike post {post.id}")

        try:
            like = Like.objects.get(post=post, user=user)
            like.delete()
            logger.info(f"User {user.id} successfully unliked post {post.id}")
            return Response({"message": "Post unliked successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            logger.warning(f"User {user.id} tried to unlike post {post.id} which they haven't liked")
            return Response({"error": "You haven't liked this post yet."}, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing comments and replies.
    """
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """
        Override to ensure the post is assigned correctly.
        """
        post_id = self.request.data.get('post')  # Fetch post_id from request data
        post = get_object_or_404(Post, id=post_id)
        logger.info(f"User {self.request.user.id} is commenting on post {post_id}")
        serializer.save(author=self.request.user, post=post)

    @action(detail=True, methods=['POST'], permission_classes=[permissions.IsAuthenticated])
    def reply(self, request, pk=None):
        """
        Reply to a specific comment.
        """
        parent_comment = self.get_object()
        content = request.data.get('content')

        logger.info(f"User {request.user.id} attempting to reply to comment {parent_comment.id}")

        if not content:
            logger.warning("Reply attempt with empty content")
            return Response({"error": "Content is required to reply."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = Comment.objects.create(
                post=parent_comment.post,
                author=request.user,
                content=content,
                parent_comment=parent_comment
            )
            logger.info(f"Reply created successfully: {comment.id}")
            return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating reply: {str(e)}")
            return Response({"error": "Failed to create reply."}, status=status.HTTP_400_BAD_REQUEST)


class LikeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing likes.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """
        Prevent duplicate likes.
        """
        post = serializer.validated_data['post']
        user = self.request.user

        logger.info(f"User {user.id} attempting to like post {post.id}")

        like, created = Like.objects.get_or_create(post=post, user=user)
        if not created:
            logger.warning(f"User {user.id} already liked post {post.id}")
            raise serializers.ValidationError("You already liked this post.")

        logger.info(f"User {user.id} successfully liked post {post.id}")
        serializer.save(user=user)
