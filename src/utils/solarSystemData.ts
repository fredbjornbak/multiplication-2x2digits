export interface SolarSystemBody {
  name: string;
  circleCount: number;
  hint: string;
  tooManyHint: string;
  color: string;
}

// Solar system data with appropriate circle counts matching real-world proportions
export const SOLAR_SYSTEM_DATA: SolarSystemBody[] = [
  {
    name: "Sun",
    circleCount: 20,
    hint: "The Sun is HUGE! You'll need a lot of circles to build it.",
    tooManyHint: "The Sun is really big, but this might be too many circles!",
    color: "#FFD700" // Gold/yellow
  },
  {
    name: "Mercury",
    circleCount: 1,
    hint: "Mercury is the smallest planet and very close to the Sun. Just 1 circle should do!",
    tooManyHint: "Mercury is tiny! That's too many circles for our smallest planet.",
    color: "#A9A9A9" // Dark gray
  },
  {
    name: "Venus",
    circleCount: 2,
    hint: "Venus is the second planet from the Sun and about the same size as Earth.",
    tooManyHint: "Venus is similar to Earth in size, but this is getting too large!",
    color: "#E3C57F" // Sandy yellow
  },
  {
    name: "Earth",
    circleCount: 3,
    hint: "Earth is our home planet! It's just a bit bigger than Venus.",
    tooManyHint: "Earth is getting too big! It's much smaller than the gas giants.",
    color: "#4169E1" // Royal blue
  },
  {
    name: "Mars",
    circleCount: 2,
    hint: "Mars is the Red Planet, smaller than Earth but bigger than Mercury.",
    tooManyHint: "Mars is actually quite small - only about half the size of Earth!",
    color: "#B22222" // Firebrick red
  },
  {
    name: "Jupiter",
    circleCount: 10,
    hint: "Jupiter is the largest planet! It's more than 11 times wider than Earth.",
    tooManyHint: "Jupiter is the biggest planet, but this might be too many circles!",
    color: "#CD853F" // Sandy brown
  },
  {
    name: "Saturn",
    circleCount: 8,
    hint: "Saturn is famous for its rings! It's almost as big as Jupiter.",
    tooManyHint: "Saturn is big, but not quite as big as Jupiter!",
    color: "#DAA520" // Goldenrod
  },
  {
    name: "Uranus",
    circleCount: 4,
    hint: "Uranus is an ice giant with a blue-green color. It's much smaller than Saturn.",
    tooManyHint: "Uranus is only about 4 times wider than Earth, so not that many circles!",
    color: "#ADD8E6" // Light blue
  },
  {
    name: "Neptune",
    circleCount: 4,
    hint: "Neptune is the farthest planet, similar in size to Uranus with a deeper blue color.",
    tooManyHint: "Neptune is similar in size to Uranus. Try using fewer circles!",
    color: "#4682B4" // Steel blue
  }
];

export function getPlanetColor(planetName: string): string {
  const planet = SOLAR_SYSTEM_DATA.find(p => p.name === planetName);
  return planet ? planet.color : "#FFD700"; // Default to gold if not found
} 