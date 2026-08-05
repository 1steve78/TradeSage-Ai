.PHONY: start stop logs reset seed test lint format

# Start all services locally using Docker Compose
start:
	docker-compose up -d

# Stop all services
stop:
	docker-compose down

# View logs for all services
logs:
	docker-compose logs -f

# Completely reset the environment (stops, removes volumes, and rebuilds)
reset:
	docker-compose down -v
	docker-compose build --no-cache

# Run database seeders (assumes a seed script exists in server/package.json)
seed:
	docker-compose exec api npm run seed

# Run tests
test:
	docker-compose exec api npm test

# Lint frontend and backend code
lint:
	cd client && npm run lint
	cd server && npm run lint

# Format frontend and backend code
format:
	cd client && npm run format
	cd server && npm run format
