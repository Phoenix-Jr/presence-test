import type { GroupDistribution, MemberEngagement, AIInsight, AppNotification, GroupRadarData } from "@/types";

export const GROUP_DISTRIBUTION: GroupDistribution[] = [
  { name: "Hommes", value: 58, color: "#6366f1" },
  { name: "Femmes", value: 62, color: "#ec4899" },
  { name: "Jeunes", value: 18, color: "#f59e0b" },
  { name: "Enfants", value: 22, color: "#10b981" },
  { name: "Visiteurs", value: 17, color: "#94a3b8" },
];

export const VISITOR_DISTRIBUTION: GroupDistribution[] = [
  { name: "Hommes", value: 7, color: "#6366f1" },
  { name: "Femmes", value: 6, color: "#ec4899" },
  { name: "Jeunes", value: 2, color: "#f59e0b" },
  { name: "Enfants", value: 2, color: "#10b981" },
];

export const GROUP_RADAR: GroupRadarData[] = [
  { group: "Chorale",   attendance: 91, consistency: 88, growth: 72, engagement: 95, retention: 89 },
  { group: "Jeunesse",  attendance: 74, consistency: 68, growth: 85, engagement: 82, retention: 70 },
  { group: "Ushers",    attendance: 87, consistency: 90, growth: 60, engagement: 78, retention: 88 },
  { group: "Diacres",   attendance: 93, consistency: 95, growth: 55, engagement: 88, retention: 94 },
  { group: "Enfants",   attendance: 88, consistency: 85, growth: 78, engagement: 91, retention: 86 },
  { group: "Prières",   attendance: 96, consistency: 94, growth: 62, engagement: 97, retention: 95 },
];

export const MOCK_ENGAGEMENT: MemberEngagement[] = [
  { memberId: "m-006", memberName: "Abena Tawiah",    gender: "female", ageGroup: "senior", attendanceRate: 98, streak: 24, lastSeen: "2024-12-22T10:10:00Z", trend: "up" },
  { memberId: "m-004", memberName: "Priscilla Anning", gender: "female", ageGroup: "adult",  attendanceRate: 96, streak: 18, lastSeen: "2024-12-22T09:55:00Z", trend: "stable" },
  { memberId: "m-013", memberName: "Isaac Nyarko",    gender: "male",   ageGroup: "senior", attendanceRate: 94, streak: 20, lastSeen: "2024-12-22T09:45:00Z", trend: "up" },
  { memberId: "m-001", memberName: "James Okafor",    gender: "male",   ageGroup: "adult",  attendanceRate: 92, streak: 11, lastSeen: "2024-12-22T10:00:00Z", trend: "stable" },
  { memberId: "m-016", memberName: "Adjoa Sarpong",   gender: "female", ageGroup: "adult",  attendanceRate: 91, streak: 9,  lastSeen: "2024-12-22T10:15:00Z", trend: "up" },
  { memberId: "m-010", memberName: "Ama Frimpong",    gender: "female", ageGroup: "child",  attendanceRate: 90, streak: 7,  lastSeen: "2024-12-22T09:50:00Z", trend: "stable" },
  { memberId: "m-014", memberName: "Nana Akua Bempah",gender: "female", ageGroup: "adult",  attendanceRate: 18, streak: 0,  lastSeen: "2024-07-20T10:00:00Z", trend: "down" },
  { memberId: "m-009", memberName: "Samuel Darko",    gender: "male",   ageGroup: "adult",  attendanceRate: 28, streak: 0,  lastSeen: "2024-08-10T10:00:00Z", trend: "down" },
  { memberId: "m-007", memberName: "Kofi Asante",     gender: "male",   ageGroup: "youth",  attendanceRate: 32, streak: 0,  lastSeen: "2024-09-15T10:00:00Z", trend: "down" },
  { memberId: "m-011", memberName: "Yaw Acheampong",  gender: "male",   ageGroup: "adult",  attendanceRate: 66, streak: 2,  lastSeen: "2024-12-01T10:00:00Z", trend: "stable" },
  { memberId: "m-012", memberName: "Ruth Ansah",      gender: "female", ageGroup: "youth",  attendanceRate: 72, streak: 3,  lastSeen: "2024-12-15T10:00:00Z", trend: "up" },
];

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: "ins-001", type: "warning", icon: "AlertTriangle",
    title: "3 membres absents depuis 6+ semaines",
    description: "Kofi Asante, Samuel Darko et Nana Akua Bempah nécessitent un suivi pastoral.",
    metric: "3 membres à risque", actionLabel: "Voir membres",
  },
  {
    id: "ins-002", type: "positive", icon: "TrendingUp",
    title: "Présence +12% vs mois dernier",
    description: "Décembre affiche une forte dynamique. Les services du dimanche matin moyennent 140+ présents.",
    metric: "+12% vs Novembre",
  },
  {
    id: "ins-003", type: "suggestion", icon: "UserPlus",
    title: "17 visiteurs cette semaine — 2 convertis",
    description: "Taux de conversion visiteur→membre: 11.8%. Suivi recommandé pour les 5 visiteurs récurrents.",
    metric: "Taux: 11.8%", actionLabel: "Voir visiteurs",
  },
  {
    id: "ins-004", type: "suggestion", icon: "Lightbulb",
    title: "Pic d'arrivée enfants: 9h00–9h30",
    description: "Programmer les activités enfants plus tôt pour maximiser la participation.",
    metric: "22 enfants moy.", actionLabel: "Voir détail",
  },
  {
    id: "ins-005", type: "positive", icon: "Star",
    title: "6 membres avec une série de 10+ semaines",
    description: "Abena Tawiah (24 sem.), Isaac Nyarko (20 sem.), Priscilla Anning (18 sem.) en tête.",
    metric: "Top 6 séries",
  },
  {
    id: "ins-006", type: "warning", icon: "Users",
    title: "Groupe jeunesse: assiduité en baisse",
    description: "La jeunesse est 14% sous la moyenne de la congrégation. Action ciblée recommandée.",
    metric: "Jeunesse: 74% moy.", actionLabel: "Voir jeunesse",
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n-001", type: "alert",   title: "Membre inactif",        message: "Kofi Asante absent depuis 10 semaines.",          createdAt: "2024-12-22T08:00:00Z", read: false, actionLabel: "Voir profil", actionHref: "/members" },
  { id: "n-002", type: "warning", title: "Présence faible",       message: "Service du 24 nov. : 75% — sous la cible 80%.",   createdAt: "2024-11-24T12:00:00Z", read: false },
  { id: "n-003", type: "success", title: "Record de présence",    message: "8 déc. : 151 présents — record annuel !",         createdAt: "2024-12-08T12:00:00Z", read: true },
  { id: "n-004", type: "info",    title: "Nouveau membre",        message: "Kwabena Poku a été ajouté au registre.",          createdAt: "2024-12-20T14:30:00Z", read: true },
  { id: "n-005", type: "alert",   title: "Membre inactif",        message: "Samuel Darko absent depuis 16 semaines.",         createdAt: "2024-12-22T08:01:00Z", read: false, actionLabel: "Voir profil", actionHref: "/members" },
  { id: "n-006", type: "success", title: "Visiteur converti",     message: "Jean Kouassi — visiteur converti en membre.",     createdAt: "2024-12-22T09:50:00Z", read: false },
  { id: "n-007", type: "info",    title: "17 visiteurs détectés", message: "Session du 22 déc. : 17 personnes inconnues détectées par l'IA.", createdAt: "2024-12-22T11:30:00Z", read: false },
];
