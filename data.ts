
import { Story, Post, SuggestedPlay, TrendingPlayer } from './types';

export const stories: Story[] = [
  {
    id: '1',
    user: { id: 'u1', name: 'Sami_tyi', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop', team: 'FC Lyon' },
    hasUnseen: true,
    // Modern Pure Silver/White
    gradient: 'from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8]'
  },
  {
    id: '2',
    user: { id: 'u2', name: 'Vinmi_cio', avatar: 'https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?q=80&w=200&h=200&auto=format&fit=crop', team: 'Real Madrid' },
    hasUnseen: false,
    // Matte Graphite
    gradient: 'from-[#3F3F46] to-[#18181B]'
  },
  {
    id: '3',
    user: { id: 'u3', name: 'Lashotd93', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop', team: 'PSG U19' },
    hasUnseen: true,
    // Steel / Titanium
    gradient: 'from-[#CBD5E1] via-[#94A3B8] to-[#64748B]'
  },
  {
    id: '4',
    user: { id: 'u4', name: 'Jefferson12', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&h=200&auto=format&fit=crop', team: 'Chelsea Acad' },
    hasUnseen: false,
    gradient: 'from-[#3F3F46] to-[#18181B]'
  },
  {
    id: '5',
    user: { id: 'u5', name: 'Mahrez_11', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&h=200&auto=format&fit=crop', team: 'Al-Ahli' },
    hasUnseen: false,
    gradient: 'from-[#3F3F46] to-[#18181B]'
  }
];

// Helper to get random users for tagging
const getSampleUsers = (count: number) => {
    const users = stories.map(s => s.user);
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export const posts: Post[] = [
  {
    id: 'p1',
    user: { 
      id: 'kp1', 
      name: 'Kevin Duboi', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwkQ9fs2m7qgWavEZRcUtFdpDeOG5HugSdI7B8imocyXKEmlsGepg6u3RsOueo_qtpMdL-A3r-Vjy44sb_yg32bt2hrX2twzhcKePgQnij6mcB0sIgyouInveNCPw_iKH4tHvhuIhnwwXa165ZwfLEo-04bp0Z7AtfWraA4HPSXaRf_AfbwP1CLoQd4gtN1o7GLqXSRYtNIHEE5TnUWT2i5vmTdnZm7TEueouf9Iz17LMbRX7-2ngluLnslCwLVZRd-c-Cd3WnayMN',
      isOnline: true,
      team: 'FC Laval'
    },
    timestamp: '19:03 • FR',
    content: 'Gros match de Futsal ce weekend! Les bleus en force. 🔵⚪️',
    hashtags: ['#futsal', '#team', '#game'],
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25d46f7?q=80&w=1000&auto=format&fit=crop',
    // Remplacement par la vidéo Google Drive fournie
    video: 'https://docs.google.com/videos/d/1agmoYLZNkVJjD7WuocImVymaCN8xZiz9sjF1H9rtBo8/edit?usp=sharing',
    stats: {
      position: 'AG',
      category: 'PLSJQ', // Elite
      age: '19'
    },
    reactionCount: 84,
    ratingCount: 16,
    commentCount: 4,
    recentReactions: [
      { id: 'r1', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGSm7lxvyU8JFKK3EoLQS64YNhMmf3FPHquXutvMsQ5l1tTI5LOmZEpyXHamohZfvjgnrRNuSZs-pZC6fV8WMNd6gwN2QZUUMu2GRJ3VD4ST0p7XbIDdmhQmjr2oNgcmg9aMvZrBuw8lGIpf9imQ0EX339jL6pbRrlrmP5HoqAxnBCWq5uNb5GLIF6CEgSi3qk9URDh-OrLLL9TZFEP8xoEUPXwqZ3pFnjoZudveEoVkHRlb-LTlnDvf9Pc0wwK8g9df9rZU5GqOG6' },
      { id: 'r2', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyEyyXWwb1zudvaZm4KvhGcE6Ebmw8LlRSEuMEHLzkbNpF2iTI3IO6NwAPdAlU3LwoMbM5vPShfh0V0b0E4cGhUTIgpEo4HAK6qmos4pK90-uEMJvD9vz_d4nAiCmAHvtTrhqZgDM3XbYdphBUjK0AwSkFDwyp6qRej0uj4EblmDbVMJtgwCtBATadgulOSi3R6vciV_mYVOcpURdkG3arxYfH2l31R4Mho94Hx-OsYa3Yw0d2qwxRXw_sQN9VRhvxQtovZiWSrso7' }
    ],
    taggedUsers: [stories[1].user, stories[2].user],
    isFollowed: true
  },
  {
    id: 'p2',
    user: { 
      id: 'u_coach', 
      name: 'Coach Carter', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHC3lw6w0T1zjTjTwNwnz2O3aqNAq0xoU2773moq4rzanVNNWG4gM1VBnL6vCpJ-MWWQooVRCpZbCcQED4K8U0Sf3hTIJeunxoYpqlcB-wl2Sm8_SFKWA-rH51Q_C_DkejUlsM3ehjqavYP_JYWl-n3gTW8Uo7O75FiLHqZ0wbXxjBNdEixlN5xVDzdH7e-r0fC9I8eeqqvtaIJM6qfxNnd-0Noe-ndSFFcgKFBIJiQcCZCleSlQ_qnwgiMbuv9Vyg97ZI6L7v3C4U',
      isOnline: true,
      team: 'London Acad'
    },
    timestamp: '14:20 • UK',
    content: 'Training session intensity 100%. Hard work pays off.',
    hashtags: ['#workhard', '#training', '#nopainnogain'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgUxXSdrJHK54f4mb4yzH9Qs8ol3BNeUDZK8kXRrLfGMIjWG4xb7T-Xg3mwGHim_R_nk289ldKpUvvNPWWGaqRnpjdVRiCPIpvQgFfkTolfcDVjBaM2WF8tmiqvUUwuMPGjhvkHfWFvTfeNd7dbO_ef5i20l13TNXbXK6-qt7iQ9lw8Z9tef52E70qDgsOsu7auTLCQPedUnYtwZtBRS-ca-3qhgkd61D2tYoJUR2t4SgP9FsUSAq_oehOEXgg7zfRD07eUwfz1Z-d',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-training-with-ball-4545-large.mp4',
    stats: {
      position: 'MC',
      category: 'PRO', // Elite
      age: '24'
    },
    reactionCount: 156,
    ratingCount: 3500,
    commentCount: 42,
    recentReactions: [
      { id: 'r3', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD8kDkWXGiKCMkZxgqkXZ2e2KU9UsjqH3eaOmcROu9SzXu8J4wPtOE9Q5dSG0et02QnoqFIXkyMODAdKR0iFXKqrcurPlEAElmq1iZtk6_IU-BDtTateup7wMgVCghITv5lR55dyctR6DpnpVBVg4scU1-1Zg7pm9Vwih8DQaIo42WDqnp95pjL8Q6CXlqxtJxsiJn7ZQ_4NEPJ51dFs1E4i2KyK7Wx10YS4a2GIVMRzVIMtxM-pwTYWMRK3v6hWFBy-j6VeLtHgV4' }
    ],
    taggedUsers: [stories[0].user, stories[3].user, stories[4].user],
    isFollowed: false
  },
  {
    id: 'p3',
    user: {
      id: 'u2',
      name: 'Vinmi_cio',
      avatar: 'https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?q=80&w=200&h=200&auto=format&fit=crop',
      isOnline: false,
      team: 'Santos FC'
    },
    timestamp: '2h ago • BR',
    content: 'Solo run at the stadium. Just me and the ball.',
    hashtags: ['#stadium', '#focus', '#dribble'],
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
    // Vidéo Drive dupliquée ici pour illustrer "plusieurs vidéos" comme demandé
    video: 'https://docs.google.com/videos/d/1agmoYLZNkVJjD7WuocImVymaCN8xZiz9sjF1H9rtBo8/edit?usp=sharing',
    stats: {
      position: 'ATT',
      category: 'ELITE', // Elite
      age: '21'
    },
    reactionCount: 342,
    ratingCount: 255,
    commentCount: 12,
    recentReactions: [
      { id: 'r1', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGSm7lxvyU8JFKK3EoLQS64YNhMmf3FPHquXutvMsQ5l1tTI5LOmZEpyXHamohZfvjgnrRNuSZs-pZC6fV8WMNd6gwN2QZUUMu2GRJ3VD4ST0p7XbIDdmhQmjr2oNgcmg9aMvZrBuw8lGIpf9imQ0EX339jL6pbRrlrmP5HoqAxnBCWq5uNb5GLIF6CEgSi3qk9URDh-OrLLL9TZFEP8xoEUPXwqZ3pFnjoZudveEoVkHRlb-LTlnDvf9Pc0wwK8g9df9rZU5GqOG6' },
      { id: 'r3', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD8kDkWXGiKCMkZxgqkXZ2e2KU9UsjqH3eaOmcROu9SzXu8J4wPtOE9Q5dSG0et02QnoqFIXkyMODAdKR0iFXKqrcurPlEAElmq1iZtk6_IU-BDtTateup7wMgVCghITv5lR55dyctR6DpnpVBVg4scU1-1Zg7pm9Vwih8DQaIo42WDqnp95pjL8Q6CXlqxtJxsiJn7ZQ_4NEPJ51dFs1E4i2KyK7Wx10YS4a2GIVMRzVIMtxM-pwTYWMRK3v6hWFBy-j6VeLtHgV4' }
    ],
    taggedUsers: [stories[2].user],
    isFollowed: true
  },
  {
    id: 'p4',
    user: {
      id: 'u5',
      name: 'Mahrez_11',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&h=200&auto=format&fit=crop',
      team: 'Al-Ahli'
    },
    timestamp: 'Yesterday',
    content: 'Free kick practice until it is perfect. 🎯⚽️',
    hashtags: ['#freekick', '#precision', '#goal'],
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-the-ball-in-the-field-4546-large.mp4',
    stats: {
      position: 'AD',
      category: 'PRO', // Elite
      age: '28'
    },
    reactionCount: 1205,
    ratingCount: 12400,
    commentCount: 89,
    recentReactions: [
      { id: 'r2', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyEyyXWwb1zudvaZm4KvhGcE6Ebmw8LlRSEuMEHLzkbNpF2iTI3IO6NwAPdAlU3LwoMbM5vPShfh0V0b0E4cGhUTIgpEo4HAK6qmos4pK90-uEMJvD9vz_d4nAiCmAHvtTrhqZgDM3XbYdphBUjK0AwSkFDwyp6qRej0uj4EblmDbVMJtgwCtBATadgulOSi3R6vciV_mYVOcpURdkG3arxYfH2l31R4Mho94Hx-OsYa3Yw0d2qwxRXw_sQN9VRhvxQtovZiWSrso7' }
    ],
    taggedUsers: [stories[0].user, stories[1].user, stories[3].user, stories[4].user],
    isFollowed: false
  },
  {
    id: 'p5',
    user: {
      id: 'u6',
      name: 'Sarah_Kicks',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      isOnline: true,
      team: 'Paris Féminin'
    },
    timestamp: 'Just now',
    content: 'Great match today girls! The spirit was amazing. 🔥',
    hashtags: ['#womensfootball', '#team', '#matchday'],
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-female-soccer-players-playing-a-match-41469-large.mp4',
    stats: {
      position: 'MC',
      category: 'U21',
      age: '20'
    },
    reactionCount: 89,
    ratingCount: 12,
    commentCount: 2,
    recentReactions: [
      { id: 'r1', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGSm7lxvyU8JFKK3EoLQS64YNhMmf3FPHquXutvMsQ5l1tTI5LOmZEpyXHamohZfvjgnrRNuSZs-pZC6fV8WMNd6gwN2QZUUMu2GRJ3VD4ST0p7XbIDdmhQmjr2oNgcmg9aMvZrBuw8lGIpf9imQ0EX339jL6pbRrlrmP5HoqAxnBCWq5uNb5GLIF6CEgSi3qk9URDh-OrLLL9TZFEP8xoEUPXwqZ3pFnjoZudveEoVkHRlb-LTlnDvf9Pc0wwK8g9df9rZU5GqOG6' }
    ],
    taggedUsers: [stories[2].user, stories[3].user],
    isFollowed: true
  },
  {
    id: 'p6',
    user: {
      id: 'u7',
      name: 'Ultra_Fans',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000&auto=format&fit=crop',
      team: 'Ultras World'
    },
    timestamp: '5h ago',
    content: 'The atmosphere at the final whistle! INCREDIBLE! 🏟️🔊',
    hashtags: ['#fans', '#ultras', '#victory'],
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-fans-cheering-in-the-stands-41482-large.mp4',
    stats: {
      position: 'FAN',
      category: 'ALL', // Not Elite
      age: '-'
    },
    reactionCount: 2401,
    ratingCount: 890,
    commentCount: 124,
    recentReactions: [
      { id: 'r3', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD8kDkWXGiKCMkZxgqkXZ2e2KU9UsjqH3eaOmcROu9SzXu8J4wPtOE9Q5dSG0et02QnoqFIXkyMODAdKR0iFXKqrcurPlEAElmq1iZtk6_IU-BDtTateup7wMgVCghITv5lR55dyctR6DpnpVBVg4scU1-1Zg7pm9Vwih8DQaIo42WDqnp95pjL8Q6CXlqxtJxsiJn7ZQ_4NEPJ51dFs1E4i2KyK7Wx10YS4a2GIVMRzVIMtxM-pwTYWMRK3v6hWFBy-j6VeLtHgV4' },
      { id: 'r2', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyEyyXWwb1zudvaZm4KvhGcE6Ebmw8LlRSEuMEHLzkbNpF2iTI3IO6NwAPdAlU3LwoMbM5vPShfh0V0b0E4cGhUTIgpEo4HAK6qmos4pK90-uEMJvD9vz_d4nAiCmAHvtTrhqZgDM3XbYdphBUjK0AwSkFDwyp6qRej0uj4EblmDbVMJtgwCtBATadgulOSi3R6vciV_mYVOcpURdkG3arxYfH2l31R4Mho94Hx-OsYa3Yw0d2qwxRXw_sQN9VRhvxQtovZiWSrso7' }
    ],
    taggedUsers: [stories[0].user, stories[1].user, stories[2].user, stories[3].user, stories[4].user],
    isFollowed: true
  },
    {
    id: 'p7',
    user: { 
      id: 'kp1', 
      name: 'Kevin Duboi', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwkQ9fs2m7qgWavEZRcUtFdpDeOG5HugSdI7B8imocyXKEmlsGepg6u3RsOueo_qtpMdL-A3r-Vjy44sb_yg32bt2hrX2twzhcKePgQnij6mcB0sIgyouInveNCPw_iKH4tHvhuIhnwwXa165ZwfLEo-04bp0Z7AtfWraA4HPSXaRf_AfbwP1CLoQd4gtN1o7GLqXSRYtNIHEE5TnUWT2i5vmTdnZm7TEueouf9Iz17LMbRX7-2ngluLnslCwLVZRd-c-Cd3WnayMN',
      isOnline: true,
      team: 'FC Laval'
    },
    timestamp: '1 day ago',
    content: 'Close control mastery. Keep the ball close.',
    hashtags: ['#control', '#skills'],
    image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d17927?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-doing-keepie-uppies-4548-large.mp4',
    stats: {
      position: 'AG',
      category: 'PLSJQ', // Elite
      age: '19'
    },
    reactionCount: 410,
    ratingCount: 56,
    commentCount: 8,
    recentReactions: [
      { id: 'r1', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGSm7lxvyU8JFKK3EoLQS64YNhMmf3FPHquXutvMsQ5l1tTI5LOmZEpyXHamohZfvjgnrRNuSZs-pZC6fV8WMNd6gwN2QZUUMu2GRJ3VD4ST0p7XbIDdmhQmjr2oNgcmg9aMvZrBuw8lGIpf9imQ0EX339jL6pbRrlrmP5HoqAxnBCWq5uNb5GLIF6CEgSi3qk9URDh-OrLLL9TZFEP8xoEUPXwqZ3pFnjoZudveEoVkHRlb-LTlnDvf9Pc0wwK8g9df9rZU5GqOG6' },
      { id: 'r2', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyEyyXWwb1zudvaZm4KvhGcE6Ebmw8LlRSEuMEHLzkbNpF2iTI3IO6NwAPdAlU3LwoMbM5vPShfh0V0b0E4cGhUTIgpEo4HAK6qmos4pK90-uEMJvD9vz_d4nAiCmAHvtTrhqZgDM3XbYdphBUjK0AwSkFDwyp6qRej0uj4EblmDbVMJtgwCtBATadgulOSi3R6vciV_mYVOcpURdkG3arxYfH2l31R4Mho94Hx-OsYa3Yw0d2qwxRXw_sQN9VRhvxQtovZiWSrso7' }
    ],
    taggedUsers: [stories[4].user],
    isFollowed: true
  },
];

export const suggestedPlays: SuggestedPlay[] = [
    {
        id: 'sp1',
        image: 'https://images.unsplash.com/photo-1600250395178-40fe75298486?q=80&w=1000&auto=format&fit=crop',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-juggling-a-ball-4549-large.mp4',
        title: 'Juggling Masterclass',
        user: { id: 'u_coach_1', name: 'Coach Mike', avatar: 'https://i.pravatar.cc/150?u=coachmike', team: 'Pro Skills' },
        role: 'Coach',
        stats: { position: 'Coach', category: 'PRO', age: '34' }
    },
    {
        id: 'sp2',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-goalkeeper-defending-a-goal-4547-large.mp4',
        title: 'Goalkeeper Drills',
        user: { id: 'u_gk_pro', name: 'Safe Hands', avatar: 'https://i.pravatar.cc/150?u=safehands', team: 'GK Academy' },
        role: 'GK Coach',
        stats: { position: 'GK Coach', category: 'ELITE', age: '29' }
    },
    {
        id: 'sp3',
        image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1000&auto=format&fit=crop',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-a-treadmill-4550-large.mp4',
        title: 'Speed Training',
        user: { id: 'u_fit', name: 'Fitness Pro', avatar: 'https://i.pravatar.cc/150?u=fitness', team: 'Speed Lab' },
        role: 'Trainer',
        stats: { position: 'Trainer', category: 'PHY', age: '27' }
    }
];

export const trendingPlayers: TrendingPlayer[] = [
    {
        id: 'tp1',
        name: 'Lucas Paquetá',
        team: 'West Ham',
        teamColor: '#7A263A',
        role: 'Midfielder',
        category: 'PRO',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop'
    },
    {
        id: 'tp2',
        name: 'Phil Foden',
        team: 'Man City',
        teamColor: '#6CABDD',
        role: 'Midfielder',
        category: 'ELITE',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop'
    },
    {
        id: 'tp3',
        name: 'Bukayo Saka',
        team: 'Arsenal',
        teamColor: '#EF0107',
        role: 'Winger',
        category: 'U23',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&h=200&auto=format&fit=crop'
    }
];
