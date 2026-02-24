import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme.dart';
import 'widgets/widgets.dart';
import 'screens/screens.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));
  runApp(const SprytoApp());
}

class SprytoApp extends StatelessWidget {
  const SprytoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SPRYTO Social',
      debugShowCheckedModeBanner: false,
      theme: getAppTheme(),
      home: const MainScaffold(),
    );
  }
}

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _selectedIndex = 0; // 0: Feed, 1: Opportunities, 2: Chat, 3: Map

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
          if (_selectedIndex == 0) const FeedScreen(),
          if (_selectedIndex == 1) const OpportunitiesScreen(),
          if (_selectedIndex == 2) const Center(child: Text('Chat', style: TextStyle(color: Colors.white))),
          if (_selectedIndex == 3) SoccerMapPage(
            onBack: () => _onItemTapped(0),
            onVenueClick: (venue) {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => VenueDetailsPage(venue: venue, onBack: () => Navigator.pop(context))),
              );
            },
          ),

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
