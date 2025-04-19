import 'package:flutter/material.dart';

class StoryCard extends StatefulWidget {
  final dynamic story;
  final VoidCallback onDelete;

  StoryCard({Key? key, required this.story, required this.onDelete}) : super(key: key);

  @override
  _StoryCardState createState() => _StoryCardState();
}

class _StoryCardState extends State<StoryCard> {
  bool _isLiked = false;
  bool _isSaved = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, '/edit/${widget.story['id']}');
      },
      child: Card(
        elevation: 3,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: InkWell(
          onTap: () {
            Navigator.pushNamed(context, '/edit/${widget.story['id']}');
          },
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Author Section
                Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: Colors.grey[200],
                      child: Text(
                        (widget.story['author'] != null &&
                                widget.story['author']['username'] != null)
                            ? widget.story['author']['username'][0].toUpperCase()
                            : '?',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                    SizedBox(width: 8),
                    Text(
                      widget.story['author'] != null &&
                              widget.story['author']['username'] != null
                          ? widget.story['author']['username']
                          : 'Anonymous',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
                SizedBox(height: 8),

                // Title Section
                Text(
                  widget.story['title'],
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
                ),
                SizedBox(height: 8),

                // Excerpt Section
                Text(
                  widget.story['excerpt'],
                  style: TextStyle(color: Colors.grey[600]),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 3,
                ),
                SizedBox(height: 8),

                // Read time and interaction buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      widget.story['readTime'],
                      style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                    ),
                    Row(
                      children: [
                        // Like Button
                        IconButton(
                          icon: Icon(
                            Icons.favorite,
                            color: _isLiked ? Colors.red : Colors.grey[400],
                          ),
                          onPressed: () {
                            setState(() {
                              _isLiked = !_isLiked;
                            });
                          },
                        ),

                        // Save Button
                        IconButton(
                          icon: Icon(
                            Icons.bookmark,
                            color: _isSaved ? Colors.indigo : Colors.grey[400],
                          ),
                          onPressed: () {
                            setState(() {
                              _isSaved = !_isSaved;
                            });
                          },
                        ),

                        // Share Button
                        IconButton(
                          icon: Icon(
                            Icons.share,
                            color: Colors.grey[400],
                          ),
                          onPressed: () {
                            // Implement share functionality if necessary
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
