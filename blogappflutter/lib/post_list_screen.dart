import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'story_card.dart';  // Import your custom StoryCard widget

class PostList extends StatefulWidget {
  @override
  _PostListState createState() => _PostListState();
}

class _PostListState extends State<PostList> {
  List posts = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchPosts();
  }

  Future<void> fetchPosts() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final response = await http.get(Uri.parse('https://your-api-url.com/posts/'));
      if (response.statusCode == 200) {
        final List data = json.decode(response.body);
        final updatedPosts = data.map((post) {
          return {
            ...post,
            'excerpt': post['content'].substring(0, 150) + '...',
            'readTime': '${(post['content'].length / 1000).ceil()} min read',
          };
        }).toList();

        setState(() {
          posts = updatedPosts;
        });
      } else {
        throw Exception('Failed to load posts');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load stories. Please try again later.';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> handleDelete(String id) async {
    final confirm = await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Delete Story'),
        content: Text('Are you sure you want to delete this story?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm) {
      try {
        final response = await http.delete(Uri.parse('https://your-api-url.com/posts/$id/'));
        if (response.statusCode == 200) {
          fetchPosts();
        } else {
          throw Exception('Failed to delete the post');
        }
      } catch (e) {
        // Handle error if needed
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (errorMessage != null) {
      return Scaffold(
        body: Center(
          child: Text(
            errorMessage!,
            style: TextStyle(color: Colors.red, fontSize: 18),
            textAlign: TextAlign.center,
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Explore Stories'),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.pushNamed(context, '/create');
            },
            icon: Icon(Icons.add),
          ),
        ],
      ),
      body: posts.isEmpty
          ? Center(child: Text('No stories found. Create your first story!'))
          : GridView.builder(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 1,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: posts.length,
              itemBuilder: (context, index) {
                final post = posts[index];
                return Stack(
                  children: [
                    StoryCard(story: post, onDelete: () => handleDelete(post['id'].toString())), // Corrected
                    Positioned(
                      top: 10,
                      right: 10,
                      child: Row(
                        children: [
                          IconButton(
                            onPressed: () {
                              Navigator.pushNamed(context, '/edit/${post['id']}');
                            },
                            icon: Icon(Icons.edit, color: Colors.indigo),
                          ),
                          IconButton(
                            onPressed: () => handleDelete(post['id'].toString()),
                            icon: Icon(Icons.delete, color: Colors.red),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
    );
  }
}
