export const sessionKey = "wellness-user-session";
export const accountsKey = "wellness-user-accounts";
export const onboardingKeyPrefix = "wellness-user-onboarding";
export const mentalMeterKeyPrefix = "wellness-user-mental-meter";
export const journalEntriesKeyPrefix = "wellness-user-journal";
export const settingsKeyPrefix = "wellness-user-settings";
export const questionnaireKeyPrefix = "wellness-user-questionnaire";

export const demoCredentials = {
  email: "guest@example.com",
  password: "hello123",
  name: "Guest User",
};

export const homeActions = [
  { id: "mind-maps", label: "Mind Maps" },
  { id: "journal", label: "Journal" },
  { id: "todo-list", label: "To Do List" },
  { id: "local-therapy", label: "Local Therapy" },
  { id: "retake-quiz", label: "Retake Quiz" },
  { id: "button-6", label: "Button 6" },
];

export const mindMapsKeyPrefix = "wellness-user-mind-maps";
export const todoListKeyPrefix = "wellness-user-todo-list";

export const quoteOptions = [
  "Small steps still count as progress.",
  "You do not have to solve everything today.",
  "Rest can be productive too.",
  "Checking in with yourself is a strength, not a weakness.",
  "Peace can start with one honest breath.",
  "Progress is often quiet at first.",
  "One good choice can change the tone of your whole day.",
  "Keep going — the future you is watching.",
  "Your pace is allowed to be human.",
  "Consistency beats intensity.",
  "You can begin again without losing what you learned.",
  "Even a tiny routine can be a lifeline.",
  "You are not behind. You are becoming.",
  "Courage can look like asking for help.",
  "Make it simple. Make it steady.",
  "The mind clears when the breath slows.",
  "Treat today like a fresh page, not a verdict.",
  "What you practice becomes your home.",
  "You are the sky, not the weather.",
  "The present moment is the only place life arrives.",
  "Let your attention be an act of love.",
  "Meaning is not found — it is made.",
  "You are a universe learning its own name.",
  "Time is a river; you are the one who chooses where to stand.",
  "Live as if your thoughts are seeds.",
];

export const zipCodeCoordinates = {
  "10001": { city: "New York, NY", latitude: 40.7506, longitude: -73.9972 },
  "30303": { city: "Atlanta, GA", latitude: 33.7529, longitude: -84.3925 },
  "33130": { city: "Miami, FL", latitude: 25.768, longitude: -80.2044 },
  "60601": { city: "Chicago, IL", latitude: 41.8864, longitude: -87.6186 },
  "73301": { city: "Austin, TX", latitude: 30.2669, longitude: -97.7428 },
  "77002": { city: "Houston, TX", latitude: 29.7561, longitude: -95.3631 },
  "80202": { city: "Denver, CO", latitude: 39.7528, longitude: -104.9992 },
  "85004": { city: "Phoenix, AZ", latitude: 33.4515, longitude: -112.0687 },
  "90012": { city: "Los Angeles, CA", latitude: 34.0614, longitude: -118.2399 },
  "94103": { city: "San Francisco, CA", latitude: 37.7725, longitude: -122.4091 },
};

export const localTherapyServices = [
  {
    id: "chi-harbor",
    name: "Harbor Counseling Collective",
    address: "125 W Lake St, Chicago, IL",
    zipCode: "60601",
    latitude: 41.8865,
    longitude: -87.6317,
    specialties: ["Anxiety", "Burnout", "Young adults"],
    availability: "In-person sessions this week",
    phone: "(312) 555-0142",
  },
  {
    id: "chi-lincoln",
    name: "North Loop Therapy Studio",
    address: "210 N Wells St, Chicago, IL",
    zipCode: "60601",
    latitude: 41.8858,
    longitude: -87.6343,
    specialties: ["Trauma", "Stress", "Work-life balance"],
    availability: "Next opening in 3 days",
    phone: "(312) 555-0195",
  },
  {
    id: "aus-spring",
    name: "Springline Wellness House",
    address: "410 Congress Ave, Austin, TX",
    zipCode: "73301",
    latitude: 30.2678,
    longitude: -97.7422,
    specialties: ["Depression", "Identity", "Life transitions"],
    availability: "Same-week in-person visits",
    phone: "(512) 555-0133",
  },
  {
    id: "aus-westlake",
    name: "Westlake Mind & Body Therapy",
    address: "702 W 6th St, Austin, TX",
    zipCode: "73301",
    latitude: 30.2692,
    longitude: -97.7509,
    specialties: ["Couples", "Grief", "Mindfulness"],
    availability: "Weekend appointments available",
    phone: "(512) 555-0176",
  },
  {
    id: "den-river",
    name: "Riverfront Counseling Center",
    address: "1550 Wewatta St, Denver, CO",
    zipCode: "80202",
    latitude: 39.7537,
    longitude: -105.0016,
    specialties: ["Anxiety", "Trauma", "Sleep"],
    availability: "Accepting new clients",
    phone: "(303) 555-0118",
  },
  {
    id: "la-echo",
    name: "Echo Park Therapy Rooms",
    address: "1300 W Sunset Blvd, Los Angeles, CA",
    zipCode: "90012",
    latitude: 34.0686,
    longitude: -118.2519,
    specialties: ["Creative professionals", "Stress", "Relationships"],
    availability: "Openings next week",
    phone: "(213) 555-0151",
  },
  {
    id: "sf-mission",
    name: "Mission Grounded Care",
    address: "240 Valencia St, San Francisco, CA",
    zipCode: "94103",
    latitude: 37.7685,
    longitude: -122.4221,
    specialties: ["LGBTQ+", "Trauma", "Community care"],
    availability: "Two in-person spots this week",
    phone: "(415) 555-0164",
  },
  {
    id: "ny-midtown",
    name: "Midtown Renewal Therapy",
    address: "320 W 37th St, New York, NY",
    zipCode: "10001",
    latitude: 40.753,
    longitude: -73.9936,
    specialties: ["Anxiety", "Panic", "Career transitions"],
    availability: "After-work appointments available",
    phone: "(646) 555-0129",
  },
];

export const questionnaireItems = [
  "How often have you felt little interest or pleasure in things you usually enjoy?",
  "How often have you felt down, hopeless, or like things won't get better?",
  "How often have you had trouble falling or staying asleep, or slept too much?",
  "How often have you felt tired or had very little energy, even after resting?",
  "How often have you felt nervous, anxious, or on edge?",
  "How often have you had trouble concentrating on everyday tasks?",
  "How often have you felt bad about yourself or like you've let others down?",
  "How often have you found it hard to stop worrying?",
  "How often have you felt lonely or disconnected from the people around you?",
  "How often have you felt overwhelmed by your daily responsibilities?",
];

export const questionnaireScale = [
  { value: 0, label: "0", description: "Not at all" },
  { value: 1, label: "1", description: "Several days" },
  { value: 2, label: "2", description: "More than half the days" },
  { value: 3, label: "3", description: "Nearly every day" },
];

export const questionnaireResourceItems = [
  "988 Suicide & Crisis Lifeline: Call or text 988",
  "Reach out to a trusted friend, family member, counselor, or therapist",
  "Use the Local Therapy page to look for nearby in-person support",
  "If you feel in immediate danger, call 911 or go to the nearest emergency room",
];
