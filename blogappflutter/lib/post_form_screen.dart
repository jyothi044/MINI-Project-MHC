import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PostFormScreen extends StatefulWidget {
  final String? postId;

  PostFormScreen({Key? key, this.postId}) : super(key: key);

  @override
  _PostFormScreenState createState() => _PostFormScreenState();
}

class _PostFormScreenState extends State<PostFormScreen> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  bool _loading = false;
  String _error = '';

  @override
  void initState() {
    super.initState();
    if (widget.postId != null) {
      _fetchPost();
    }
  }

  Future<void> _fetchPost() async {
    setState(() {
      _loading = true;
    });

    try {
      final response = await http.get(Uri.parse('https://your-api-url.com/posts/${widget.postId}/'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _titleController.text = data['title'];
        _contentController.text = data['content'];
      } else {
        setState(() {
          _error = 'Failed to load the story. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to load the story. Please try again.';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _handleSubmit() async {
    setState(() {
      _error = '';
      _loading = true;
    });

    try {
      final payload = {
        'title': _titleController.text,
        'content': _contentController.text,
      };

      if (widget.postId != null) {
        await http.put(
          Uri.parse('https://your-api-url.com/posts/${widget.postId}/'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(payload),
        );
      } else {
        await http.post(
          Uri.parse('https://your-api-url.com/posts/'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(payload),
        );
      }

      Navigator.of(context).pushNamed('/stories');
    } catch (e) {
      setState(() {
        _error = 'Failed to save the story. Please try again.';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.postId == null ? 'Create New Story' : 'Edit Story'),
      ),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_error.isNotEmpty)
                    Container(
                      padding: EdgeInsets.all(8),
                      margin: EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.red[50],
                        border: Border(left: BorderSide(color: Colors.red, width: 4)),
                      ),
                      child: Text(
                        _error,
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                  TextFormField(
                    controller: _titleController,
                    decoration: InputDecoration(
                      labelText: 'Title',
                      border: OutlineInputBorder(),
                    ),
                    maxLength: 100,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Title is required';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    controller: _contentController,
                    decoration: InputDecoration(
                      labelText: 'Content',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 10,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Content is required';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        child: Text('Cancel'),
                      ),
                      SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: _handleSubmit,
                        child: Text(widget.postId == null ? 'Create' : 'Save'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
    );
  }
}
