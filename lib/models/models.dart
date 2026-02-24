import 'package:flutter/material.dart';

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

final List<FieldData> soccerFields = [
  FieldData(id: 1, name: "Parc Jarry", location: "Montréal, QC", type: "Synthétique", distance: "0,8 km", playersPresent: 28, image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop", lat: 45.5333, lng: -73.6231),
  FieldData(id: 2, name: "Complexe Sportif Claude-Robillard", location: "Montréal, QC", type: "Naturel", distance: "2,4 km", playersPresent: 14, image: "https://images.unsplash.com/photo-1575361204480-aadea25d46f7?q=80&w=1000", lat: 45.5539, lng: -73.6358),
  FieldData(id: 3, name: "Stade Saputo", location: "Montréal, QC", type: "Pro", distance: "5,1 km", playersPresent: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Stade_Saputo_2012.jpg/1200px-Stade_Saputo_2012.jpg", lat: 45.5631, lng: -73.5517),
];
