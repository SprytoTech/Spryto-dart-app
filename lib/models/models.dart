import 'package:flutter/material.dart';

class User {
  final String id;
  final String name;
  final String avatar;
  final String team;
  final bool isOnline;

  User(
      {required this.id,
      required this.name,
      required this.avatar,
      required this.team,
      this.isOnline = false});
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
  final int reactionCount;
  final bool isFollowed;
  final List<String> recentReactions;

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
    required this.reactionCount,
    required this.isFollowed,
    this.recentReactions = const [],
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

class SuggestedPlay {
  final String id;
  final String image;
  final String title;
  final String userName;
  final String userAvatar;

  SuggestedPlay(
      {required this.id,
      required this.image,
      required this.title,
      required this.userName,
      required this.userAvatar});
}

class TrendingPlayer {
  final String id;
  final String name;
  final String team;
  final Color teamColor;
  final String image;

  TrendingPlayer(
      {required this.id,
      required this.name,
      required this.team,
      required this.teamColor,
      required this.image});
}

class FieldData {
  final int id;
  final String name;
  final String location;
  final String type;
  final String distance;
  final int playersPresent;
  final String image;
  final double lat;
  final double lng;

  FieldData({
    required this.id,
    required this.name,
    required this.location,
    required this.type,
    required this.distance,
    required this.playersPresent,
    required this.image,
    required this.lat,
    required this.lng,
  });
}

// Mock Data
final currentUser = User(
  id: 'kp1',
  name: 'Kevin Duboi',
  avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop',
  team: 'FC Laval',
  isOnline: true,
);

final List<Post> posts = [
  Post(
    id: 'p1',
    user: currentUser,
    timestamp: '19:03 • FR',
    content:
        'Gros match de Futsal ce weekend! Les bleus en force. 🔵⚪️ #futsal',
    image:
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
    position: 'AG',
    category: 'PLSJQ',
    age: '19',
    ratingCount: 16,
    commentCount: 4,
    reactionCount: 84,
    isFollowed: true,
    recentReactions: [
      'https://i.pravatar.cc/150?u=1',
      'https://i.pravatar.cc/150?u=2'
    ],
  ),
  Post(
    id: 'p2',
    user: User(
      id: 'u_coach',
      name: 'Coach Carter',
      avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop',
      team: 'London Acad',
      isOnline: true,
    ),
    timestamp: '14:20 • UK',
    content: 'Training session intensity 100%. Hard work pays off. 🔥⚽️',
    image:
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop',
    position: 'MC',
    category: 'PRO',
    age: '24',
    ratingCount: 3500,
    commentCount: 42,
    reactionCount: 156,
    isFollowed: false,
    recentReactions: ['https://i.pravatar.cc/150?u=5'],
  ),
];

final List<SuggestedPlay> suggestedPlays = [
  SuggestedPlay(
    id: 'sp1',
    image:
        'https://images.unsplash.com/photo-1600250395178-40fe75298486?q=80&w=600&auto=format&fit=crop',
    title: 'Juggling Masterclass',
    userName: 'Coach Mike',
    userAvatar: 'https://i.pravatar.cc/150?u=coach1',
  ),
  SuggestedPlay(
    id: 'sp2',
    image:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
    title: 'Goalkeeper Drills',
    userName: 'Safe Hands',
    userAvatar: 'https://i.pravatar.cc/150?u=coach2',
  ),
];

final List<TrendingPlayer> trendingPlayers = [
  TrendingPlayer(
    id: 'tp1',
    name: 'Lucas Paquetá',
    team: 'West Ham',
    teamColor: const Color(0xFF7A263A),
    image:
        'https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?q=80&w=200&h=200&auto=format&fit=crop',
  ),
  TrendingPlayer(
    id: 'tp2',
    name: 'Phil Foden',
    team: 'Man City',
    teamColor: const Color(0xFF6CABDD),
    image:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&h=200&auto=format&fit=crop',
  ),
];

final List<Opportunity> opportunities = [
  Opportunity(
    id: 'opp1',
    type: 'Tryout',
    title: 'Détection U15-U18',
    club: 'CF Montréal',
    clubLogo:
        'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3e/CF_Montr%C3%A9al_logo_2023.svg/200px-CF_Montr%C3%A9al_logo_2023.svg.png',
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
    clubLogo:
        'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/Toronto_FC_Logo.svg/200px-Toronto_FC_Logo.svg.png',
    date: '20-22 Avr',
    location: 'BMO Field',
    tags: ['Scouts', 'Boys'],
    isFeatured: true,
    backgroundColor: const Color(0xFF991B1B),
  ),
];

final List<FieldData> soccerFields = [
  FieldData(
      id: 1,
      name: "Parc Jarry",
      location: "Montréal, QC",
      type: "Synthétique",
      distance: "0,8 km",
      playersPresent: 28,
      image:
          "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop",
      lat: 45.5333,
      lng: -73.6231),
  FieldData(
      id: 2,
      name: "Stade Saputo",
      location: "Montréal, QC",
      type: "Pro",
      distance: "5,1 km",
      playersPresent: 0,
      image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Stade_Saputo_2012.jpg/1200px-Stade_Saputo_2012.jpg",
      lat: 45.5631,
      lng: -73.5517),
];
