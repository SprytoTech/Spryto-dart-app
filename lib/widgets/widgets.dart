import 'dart:ui';
import 'package:flutter/material.dart';
import '../models/models.dart';
import '../theme.dart';

class GlassHeader extends StatelessWidget {
  const GlassHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: EdgeInsets.only(
            top: MediaQuery.of(context).padding.top + 10,
            bottom: 15,
            left: 20,
            right: 20,
          ),
          decoration: BoxDecoration(
            color: AppColors.background.withOpacity(0.8),
            border: const Border(bottom: BorderSide(color: AppColors.glassBorder)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Icon(Icons.add_circle_outline, color: Colors.white, size: 28),
              Text(
                'SPRYTO',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                  color: Colors.white,
                ),
              ),
              Row(
                children: [
                  Icon(Icons.search, color: Colors.white, size: 28),
                  SizedBox(width: 20),
                  Icon(Icons.notifications_none, color: Colors.white, size: 28),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class PostCard extends StatelessWidget {
  final Post post;

  const PostCard({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 30, left: 10, right: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E23).withOpacity(0.4),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ListTile(
            leading: CircleAvatar(backgroundImage: NetworkImage(post.user.avatar)),
            title: Text(post.user.name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
            subtitle: Text('${post.position} - ${post.user.team}', style: const TextStyle(fontSize: 10, color: Colors.grey)),
            trailing: const Icon(Icons.more_horiz, color: Colors.grey),
          ),
          if (post.image != null)
            Container(
              height: 400,
              decoration: BoxDecoration(
                image: DecorationImage(image: NetworkImage(post.image!), fit: BoxFit.cover),
              ),
              child: const Center(
                  child: Icon(Icons.play_circle_fill, size: 48, color: Colors.white70),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.sports_soccer, size: 18, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text('${post.ratingCount}K', style: const TextStyle(color: Colors.grey)),
                    const SizedBox(width: 16),
                    const Icon(Icons.chat_bubble_outline, size: 18, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text('${post.commentCount}', style: const TextStyle(color: Colors.grey)),
                  ],
                ),
                const Icon(Icons.bookmark_border, color: Colors.grey),
              ],
            ),
          )
        ],
      ),
    );
  }
}

class GlassBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const GlassBottomNav({super.key, required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        _buildCircleButton(Icons.home, isActive: currentIndex == 0, onTap: () => onTap(0)),
        const SizedBox(width: 10),
        ClipRRect(
          borderRadius: BorderRadius.circular(32),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              height: 64,
              padding: const EdgeInsets.symmetric(horizontal: 24),
              decoration: BoxDecoration(
                color: AppColors.background.withOpacity(0.9),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.sports_soccer, color: Colors.grey, size: 26),
                  const SizedBox(width: 24),
                  InkWell(
                    onTap: () => onTap(1),
                    child: Icon(
                        Icons.local_activity_outlined, 
                        color: currentIndex == 1 ? Colors.white : Colors.grey, 
                        size: 26
                    ),
                  ),
                  const SizedBox(width: 24),
                  InkWell(
                    onTap: () => onTap(2),
                    child: Icon(Icons.chat_bubble_outline, color: currentIndex == 2 ? Colors.white : Colors.grey, size: 26),
                  ),
                  const SizedBox(width: 24),
                  const Icon(Icons.person_outline, color: Colors.grey, size: 28),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        _buildCircleButton(Icons.stadium_outlined, isActive: currentIndex == 3, onTap: () => onTap(3)),
      ],
    );
  }

  Widget _buildCircleButton(IconData icon, {required bool isActive, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 48,
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: AppColors.background.withOpacity(0.9),
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.glassBorder),
          boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 10)],
        ),
        child: Center(
            child: Icon(icon, color: isActive ? Colors.white : Colors.grey, size: 22),
        ),
      ),
    );
  }
}

class LocationModal extends StatefulWidget {
  const LocationModal({super.key});

  @override
  State<LocationModal> createState() => _LocationModalState();
}

class _LocationModalState extends State<LocationModal> {
  double distance = 0;
  
  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: Color(0xFF0F1115),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          const SizedBox(height: 12),
          Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2))),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Location', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                hintText: 'Recherchez une ville...',
                filled: true,
                fillColor: const Color(0xFF2C2C2E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(children: [
                       Icon(Icons.location_on, size: 16),
                       SizedBox(width: 8),
                       Text('Montréal, QC', style: TextStyle(fontWeight: FontWeight.bold)),
                    ]),
                    Text(distance == 0 ? 'Exact' : '+ ${distance.toInt()} km', style: const TextStyle(color: Colors.blue)),
                  ],
                ),
                Slider(
                  value: distance,
                  min: 0,
                  max: 100,
                  activeColor: Colors.blue,
                  inactiveColor: Colors.white10,
                  onChanged: (val) => setState(() => distance = val),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Expanded(
             child: ListView(
               padding: const EdgeInsets.symmetric(horizontal: 20),
               children: [
                 const Text('RÉCENT', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
                 const SizedBox(height: 10),
                 _buildListItem('Toronto, ON'),
                 _buildListItem('Québec, QC'),
                 const SizedBox(height: 20),
                 const Text('QUARTIERS SUGGÉRÉS', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
                 const SizedBox(height: 10),
                 _buildListItem('Plateau-Mont-Royal'),
                 _buildListItem('Ville-Marie'),
                 _buildListItem('Rosemont'),
                 _buildListItem('Verdun'),
               ],
             ),
          ),
        ],
      ),
    );
  }

  Widget _buildListItem(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(children: [
         const Icon(Icons.history, color: Colors.grey, size: 20),
         const SizedBox(width: 12),
         Text(text, style: const TextStyle(fontSize: 14)),
      ]),
    );
  }
}
