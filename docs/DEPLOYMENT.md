# Deployment

## Hosting Model

IK Pulse uses a split hosting model:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL

## Why Vercel for Frontend?

Vercel is a strong fit for:
- React and Vite frontend hosting
- fast static asset delivery
- easy deployment workflow
- straightforward custom domain handling

## Why Render for Backend?

Render is a strong fit for:
- always-on backend services
- environment variables
- health checks
- managed service deployment
- Node.js API hosting

## Why separate frontend and backend hosting?

The frontend and backend have different runtime responsibilities.

The frontend primarily serves UI assets and browser interactions.

The backend manages:
- authentication
- business logic
- database access
- internal operational workflows

Separating them allows each layer to live on the platform best suited to it.

## CI/CD

The project includes GitHub Actions to validate builds and improve deployment confidence.

## Docker

The backend was containerised to improve consistency across environments and to better reflect real deployment considerations.