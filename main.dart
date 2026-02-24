import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));
  runApp(const SprytoApp());
}

// --- Thème & Constantes ---
class AppColors {
  static const Color background = Color(0xFF0F1115);
  static const Color card = Color(0xFF151518);
  static const Color primary = Color(0xFFFF4757);
  static const Color neonPink = Color(0xFFF43F5E);
  static const Color neonViolet = Color(0xFF8B5CF6);
  static const Color secondary = Color(0xFF2F80ED);
  static const Color textMain = Colors.white;
  static const Color textSec = Color(0xFFA1A1AA);
  static const Color glassBorder = Color(0x14FFFFFF);
}

class SprytoApp extends StatelessWidget {
  const SprytoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SPRYTO Social',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.primary,
        useMaterial3: true,
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      ),
      home: const MainScaffold(),
    );
  }
}

// --- Data Models ---

class User {
  final String id;
  final String name;
  final String avatar;
  final String team;

  User({required this.id, required this.name, required this.avatar, required this.team});
}

class Post {
  final String id;
  final User user;
  final String timestamp;
  final String content;
  final String? image;
  final String? video;
  final String position;
  final String category;
  final String age;
  final int ratingCount;
  final int commentCount;
  final bool isFollowed;

  Post({
    required this.id,
    required this.user,
    required this.timestamp,
    required this.content,
    this.image,
    this.video,
    required this.position,
    required this.category,
    required this.age,
    required this.ratingCount,
    required this.commentCount,
    required this.isFollowed,
  });
}

class Opportunity {
  final String id;
  final String type;
  final String title;
  final String club;
  final String clubLogo;
  final String date;
  final String location;
  final List<String> tags;
  final bool isFeatured;
  final Color? backgroundColor;

  Opportunity({
    required this.id,
    required this.type,
    required this.title,
    required this.club,
    required this.clubLogo,
    required this.date,
    required this.location,
    required this.tags,
    required this.isFeatured,
    this.backgroundColor,
  });
}

// --- Mock Data ---

final currentUser = User(
  id: 'kp1',
  name: 'Kevin Duboi',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwkQ9fs2m7qgWavEZRcUtFdpDeOG5HugSdI7B8imocyXKEmlsGepg6u3RsOueo_qtpMdL-A3r-Vjy44sb_yg32bt2hrX2twzhcKePgQnij6mcB0sIgyouInveNCPw_iKH4tHvhuIhnwwXa165ZwfLEo-04bp0Z7AtfWraA4HPSXaRf_AfbwP1CLoQd4gtN1o7GLqXSRYtNIHEE5TnUWT2i5vmTdnZm7TEueouf9Iz17LMbRX7-2ngluLnslCwLVZRd-c-Cd3WnayMN',
  team: 'FC Laval',
);

final List<Post> posts = [
  Post(
    id: 'p1',
    user: currentUser,
    timestamp: '19:03 • FR',
    content: 'Gros match de Futsal ce weekend! Les bleus en force. 🔵⚪️ #futsal',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25d46f7?q=80&w=1000&auto=format&fit=crop',
    position: 'AG',
    category: 'PLSJQ',
    age: '19',
    ratingCount: 16,
    commentCount: 4,
    isFollowed: true,
  ),
  Post(
    id: 'p2',
    user: User(id: 'u_coach', name: 'Coach Carter', avatar: 'https://i.pravatar.cc/150?u=coach', team: 'London Acad'),
    timestamp: '14:20 • UK',
    content: 'Training session intensity 100%. Hard work pays off.',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000',
    position: 'MC',
    category: 'PRO',
    age: '24',
    ratingCount: 3500,
    commentCount: 42,
    isFollowed: false,
  ),
];

final List<Opportunity> opportunities = [
  Opportunity(
    id: 'opp1',
    type: 'Tryout',
    title: 'Détection U15-U18',
    club: 'CF Montréal',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3e/CF_Montr%C3%A9al_logo_2023.svg/200px-CF_Montr%C3%A9al_logo_2023.svg.png',
    date: '18-19 Jan',
    location: 'Centre Nutrilait',
    tags: ['Elite', 'Mixte'],
    isFeatured: true,
    backgroundColor: const Color(0xFF1E40AF),
  ),
  Opportunity(
    id: 'opp2',
    type: 'Showcase',
    title: 'Showcase Élite 2024',
    club: 'Toronto FC',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/Toronto_FC_Logo.svg/200px-Toronto_FC_Logo.svg.png',
    date: '20-22 Avr',
    location: 'BMO Field',
    tags: ['Scouts', 'Boys'],
    isFeatured: true,
    backgroundColor: const Color(0xFF991B1B),
  ),
  Opportunity(
    id: 'opp3',
    type: 'Programme',
    title: 'Stage Perfectionnement',
    club: 'Real Madrid',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/200px-Real_Madrid_CF.svg.png',
    date: '01-05 Août',
    location: 'Madrid, ES',
    tags: ['Technique', 'Mixte'],
    isFeatured: false,
  ),
];

// --- Main Navigation Wrapper ---

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _selectedIndex = 0; // 0: Feed, 1: Opportunities

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true, // For glassmorphism bottom nav
      body: Stack(
        children: [
          // Views
          _selectedIndex == 0 ? const FeedScreen() : const OpportunitiesScreen(),

          // Header (Only for Feed)
          if (_selectedIndex == 0)
            const Positioned(top: 0, left: 0, right: 0, child: GlassHeader()),

          // Bottom Nav
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Center(
              child: GlassBottomNav(
                currentIndex: _selectedIndex,
                onTap: _onItemTapped,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// --- Feed Screen ---

class FeedScreen extends StatelessWidget {
  const FeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(top: 100, bottom: 120),
      children: [
        // Stories
        SizedBox(
          height: 100,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            scrollDirection: Axis.horizontal,
            itemCount: 5,
            separatorBuilder: (_, __) => const SizedBox(width: 15),
            itemBuilder: (context, index) => _buildStoryItem(index),
          ),
        ),
        const SizedBox(height: 20),

        // Filter Tabs
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            children: [
              _buildFilterChip('For you', isActive: true),
              const SizedBox(width: 10),
              _buildFilterChip('Élite Plays'),
              const SizedBox(width: 10),
              _buildFilterChip('Friends'),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Posts
        ...posts.map((post) => PostCard(post: post)).toList(),
      ],
    );
  }

  Widget _buildStoryItem(int index) {
    final names = ['Sami_tyi', 'Vinmi_cio', 'Lashotd93', 'Jefferson', 'Mahrez'];
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: index % 2 == 0
                ? const LinearGradient(colors: [Colors.white, Color(0xFF94A3B8)])
                : const LinearGradient(colors: [Color(0xFF3F3F46), Color(0xFF18181B)]),
          ),
          child: CircleAvatar(
            radius: 30,
            backgroundImage: NetworkImage('https://i.pravatar.cc/150?u=$index'),
          ),
        ),
        const SizedBox(height: 4),
        Text(names[index], style: const TextStyle(fontSize: 11, color: Colors.white)),
      ],
    );
  }

  Widget _buildFilterChip(String label, {bool isActive = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: isActive ? Colors.white : Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isActive ? Colors.black : Colors.grey[300],
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }
}

// --- Opportunities Screen ---

class OpportunitiesScreen extends StatelessWidget {
  const OpportunitiesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final featured = opportunities.where((o) => o.isFeatured).toList();
    final others = opportunities.where((o) => !o.isFeatured).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            backgroundColor: AppColors.background.withOpacity(0.9),
            floating: true,
            pinned: true,
            title: const Text('Opportunités', style: TextStyle(fontWeight: FontWeight.bold)),
            actions: [
               IconButton(
                 icon: const Icon(Icons.location_on, size: 20, color: Colors.blue),
                 onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (context) => const LocationModal(),
                    );
                 },
               ),
            ],
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(60),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Rechercher (Club, Ville...)',
                    hintStyle: const TextStyle(color: Colors.grey),
                    prefixIcon: const Icon(Icons.search, color: Colors.grey),
                    filled: true,
                    fillColor: const Color(0xFF1E232E),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  ),
                ),
              ),
            ),
          ),
          
          // Featured Horizontal List
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.only(left: 16, top: 16, bottom: 8),
              child: const Text('À la une', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 200,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: featured.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final opp = featured[index];
                  return Container(
                    width: 280,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: opp.backgroundColor ?? Colors.blue,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 40, height: 40,
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
                              child: Image.network(opp.clubLogo),
                            ),
                            const Spacer(),
                            const Icon(Icons.bookmark_border, color: Colors.white),
                          ],
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(4)),
                          child: Text(opp.type.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(height: 4),
                        Text(opp.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, height: 1.1)),
                        Text(opp.club, style: const TextStyle(fontSize: 12, color: Colors.white70)),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),

          // List Items
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.only(left: 16, top: 24, bottom: 8),
              child: const Text('Tout', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final opp = others[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E232E),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    child: Row(
                      children: [
                        Container(
                           width: 50, height: 50,
                           padding: const EdgeInsets.all(6),
                           decoration: BoxDecoration(color: const Color(0xFF2C2C2E), borderRadius: BorderRadius.circular(10)),
                           child: Image.network(opp.clubLogo),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(opp.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                              Text('${opp.club} • ${opp.location}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right, color: Colors.grey),
                      ],
                    ),
                  ),
                );
              },
              childCount: others.length,
            ),
          ),
          const SliverPadding(padding: EdgeInsets.only(bottom: 120)),
        ],
      ),
    );
  }
}

// --- Components ---

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
                  const Icon(Icons.chat_bubble_outline, color: Colors.grey, size: 26),
                  const SizedBox(width: 24),
                  const Icon(Icons.person_outline, color: Colors.grey, size: 28),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        _buildCircleButton(Icons.stadium_outlined, isActive: false, onTap: () {}),
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
        color: Color(0xFF0F1115), // Requested BG Color
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
