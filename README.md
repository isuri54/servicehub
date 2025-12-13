## ServiceHub — Full-Stack Service Booking Platform

[![CI/CD Pipeline](https://github.com/isuri54/servicehub/actions/workflows/cicd.yml/badge.svg)](https://github.com/isuri54/servicehub/actions/workflows/cicd.yml)
Frontend: http://localhost:3000 | Backend: http://localhost:5000

ServiceHub is a Dockerized MERN-stack platform that connects clients with verified local service providers (plumbers, carpenters, cleaners, electricians, etc.). Clients can discover, chat, book, and review providers — all in one seamless experience.
Built with modern DevOps practices: Docker, CI/CD, real-time chat, role-based access, responsive design.

## Features

Provider Discovery & Booking:
Search for verified service providers by category and district, view detailed profiles with work portfolio, ratings, experience, and availability, then book instantly via an interactive calendar (single-day or long-term projects).
Real-Time Chat System:
Initiate and manage private conversations with providers, enjoy live messaging powered by Socket.io, and stay connected throughout the booking process with a clean, mobile-friendly interface.
Smart Booking Calendar:
Choose single-day services or long-term projects, see provider availability in real-time, avoid booked/unavailable dates automatically, and receive instant confirmation upon booking.
District-Based Filtering:
Filter providers by your district to find local professionals quickly and reliably — perfect for urgent or location-specific jobs.
Provider Dashboard & Earnings:
Providers get a dedicated portal to manage their profile, view upcoming jobs, track total earnings, respond to messages, and update availability — all in one place.
Reviews & Rating System:
After a completed job, clients can leave star ratings and written reviews. Providers build reputation and trust with every positive feedback.
Responsive & Mobile-First Design:
Beautiful, fast, and fully functional on phones, tablets, and desktops — built with Tailwind CSS for a modern user experience.
Dockerized Full-Stack Architecture:
Frontend (React + Nginx), Backend (Node.js/Express), and Database (MongoDB) all run in separate containers, deployable with a single command.
CI/CD Ready:
GitHub Actions pipeline automatically tests and builds the app on every push.

## Teck Stack

Frontend: React 19, React Router v7, Tailwind CSS
Backend: Node.js, Express, Socket.io
Database: MongoDB
Auth: JWT + RBAC + bcrypt
File Upload: Multer + local storage
Container: Docker + Docker Compose
CI/CD: GitHub Actions

## Screenshots

### Signup Page
<img width="1919" height="918" alt="Screenshot 2025-12-11 011444" src="https://github.com/user-attachments/assets/b5d861dd-f1ea-4d45-a197-1fbadb22911e" />
### Login Page
<img width="1919" height="916" alt="Screenshot 2025-12-11 011411" src="https://github.com/user-attachments/assets/d66b2ecb-9ac8-4565-bb2a-a4506e9b78a8" />
### Become Provider Page
<img width="1919" height="915" alt="Screenshot 2025-12-13 005738" src="https://github.com/user-attachments/assets/dfdaab93-8c22-4eaf-ba8e-fd17ec028388" />
### Home Page
<img width="1919" height="914" alt="Screenshot 2025-12-11 001619" src="https://github.com/user-attachments/assets/ffb00c3c-212a-46d6-b988-bb3db8f67e6d" />
<img width="1919" height="907" alt="Screenshot 2025-12-10 231443" src="https://github.com/user-attachments/assets/6d98f19e-8e9a-4ed7-921b-3d554c630f2d" />
### Category Providers Page
<img width="1919" height="913" alt="Screenshot 2025-12-13 000603" src="https://github.com/user-attachments/assets/ad1af1b1-6beb-4c77-b3b0-2f6a164e6e0a" />
### My Bookings Page
<img width="1919" height="923" alt="Screenshot 2025-12-11 004339" src="https://github.com/user-attachments/assets/f2dba8dd-a6d2-452c-a58b-37cfd9d3d293" />
### Messages
<img width="1919" height="920" alt="Screenshot 2025-12-13 004338" src="https://github.com/user-attachments/assets/1ad330af-442b-4744-b0fb-6515cc333f29" />
### User Profile
<img width="1918" height="918" alt="Screenshot 2025-12-10 232006" src="https://github.com/user-attachments/assets/8e7472d6-5b59-4d5b-8ad3-9fd1949a0b81" />
### Provider Profile View Page
<img width="1918" height="914" alt="Screenshot 2025-12-13 004837" src="https://github.com/user-attachments/assets/0d13aa25-6df4-4af0-86d3-0b8683ba6f20" />
### Bookings
<img width="1919" height="897" alt="Screenshot 2025-12-13 000703" src="https://github.com/user-attachments/assets/72afdd61-bc0e-4ade-9f7f-026d1549c508" />
### Send Messages
<img width="1919" height="913" alt="Screenshot 2025-12-13 001124" src="https://github.com/user-attachments/assets/e4484b47-b2eb-465b-9e53-658e644cb974" />
### Call Provider
<img width="1919" height="920" alt="Screenshot 2025-12-13 000735" src="https://github.com/user-attachments/assets/0ad1cd27-c9bb-4c95-8612-32e6517670f7" />
### Provider Dashboard
<img width="1919" height="922" alt="Screenshot 2025-12-13 001238" src="https://github.com/user-attachments/assets/f67e4949-0dbe-47d3-b146-8a1e3a4906a7" />
<img width="1919" height="919" alt="Screenshot 2025-12-13 001304" src="https://github.com/user-attachments/assets/a7cae0d9-5392-4a15-8e94-eb6da1f89b6d" />
### Update Availability
<img width="1919" height="923" alt="Screenshot 2025-12-13 001340" src="https://github.com/user-attachments/assets/3a2a6ae4-7514-4821-b507-7700505af9d3" />
### Quick Stats
<img width="1919" height="910" alt="Screenshot 2025-12-13 001412" src="https://github.com/user-attachments/assets/1cda1cd1-6c04-4616-92f2-ab501b4fa31f" />
### My Earnings
<img width="1919" height="920" alt="Screenshot 2025-12-13 001514" src="https://github.com/user-attachments/assets/a5fd8a65-c6eb-44d0-907a-4c388b15ae2d" />
### Provider Profile
<img width="1919" height="913" alt="Screenshot 2025-12-13 001549" src="https://github.com/user-attachments/assets/3558033f-504c-4871-8c98-1e2dd10510c3" />
### Messages (Provider)
<img width="1919" height="920" alt="Screenshot 2025-12-13 004338" src="https://github.com/user-attachments/assets/62e71e30-2468-496c-9e0b-9f737c6eb882" />

## Getting Started

(Docker)
Clone the repository:
git clone https://github.com/isuri54/servicehub.git
cd servicehub

docker-compose up --build

(Manual)
#Backend
cd backend
npm install
npm run dev

#Frontend
cd frontend
npm install
npm start

