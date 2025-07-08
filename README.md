# GradeAid: Interactive Learning Platform

GradeAid is an interactive educational platform designed to help students aged 9-12 learn multiplication concepts through engaging, environmentally-themed exercises and visualizations. The application combines adaptive learning technology with sustainability themes to create a meaningful learning experience.

## Project Overview

GradeAid uses interactive visualizations, 3D models, and a virtual AI math tutor to help students understand multiplication concepts. The platform adapts to each student's learning style and proficiency level, making math education more personalized and effective.

### Key Features

- **Interactive Multiplication Exercises**: Practice basic multiplication with adaptive difficulty
- **3D Box Method Visualization**: Experience multiplication visually through an interactive 3D box method
- **AI Math Tutor**: Get personalized help through an integrated chat interface powered by OpenAI
- **Environmental Themes**: Learn multiplication in the context of tree planting, renewable energy, and conservation
- **Adaptive Learning**: Exercises adjust based on the student's performance and learning profile
- **Progress Tracking**: Monitor improvement over time with detailed performance analytics

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd gradeaid-v2
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:8081 (or the port shown in your terminal)

## Setting up the AI Tutor Chat Feature

The math tutor chat feature uses OpenAI's API to provide intelligent responses to student questions. To enable this feature:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Create a `.env` file in the root directory (or copy from `.env.example`)
3. Add your OpenAI API key to the `.env` file:
   ```
   VITE_OPEN_AI_API_KEY=your_openai_api_key_here
   ```
4. Restart your development server

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for user data and adaptive model
- **3D Visualization**: Three.js with React Three Fiber
- **AI Integration**: OpenAI API for the math tutor feature
- **Build Tool**: Vite

## Project Structure

- `/src/components` - UI components including exercises and visualizations
  - `BoxMethod3D.tsx` - 3D visualization of the box method
  - `BoxMethodVisual.tsx` - 2D visualization with interactive rows/columns
  - `MultiplicationExercise.tsx` - Basic multiplication exercises
  - `ChatSidebar.tsx` - AI math tutor interface
- `/src/store` - State management
  - `userStore.ts` - User model tracking learning progress and preferences
  - `onboardingStore.ts` - Onboarding flow state management
- `/src/utils` - Utility functions
  - `adaptiveSystem.ts` - Logic for adaptive difficulty and learning progression
- `/src/pages` - Application pages and routes
- `/src/hooks` - Custom React hooks

## Educational Approach

GradeAid uses several pedagogical approaches:

1. **Discovery-Based Learning**: Students explore multiplication concepts through interactive visualizations rather than memorization.

2. **Visual Learning**: The box method provides a visual representation of how multiplication works.

3. **Contextual Learning**: Math problems are presented in environmental contexts, making abstract concepts more relatable.

4. **Adaptive Learning**: The system adjusts difficulty based on student performance, learning style, and cognitive parameters.

5. **Immediate Feedback**: Students receive timely feedback to reinforce correct understanding.

## Contributing

Contributions to GradeAid are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
