# Workshop "From zero to a REST API with node.js and PostgreSQL"

Prague PostgreSQL Developers Day 2020 - https://p2d2.cz

05/02/20

---

Docker run instructions

```bash
docker network create prague-app

docker build -t braces/prague-poi-db -f Dockerfile.db .

docker run -itd --name prague-poi-db -p 5432:5432 \
  --network prague-app \
  -e POSTGRES_DB=prague-poi \
  -e POSTGRES_USER=prague \
  -e POSTGRES_PASSWORD=p2d2 \
braces/prague-poi-db

docker build -t braces/prague-poi-app -f Dockerfile.app .

docker run -itd --name prague-poi-app -p 9002:9002 \
  --network prague-app \
  -e NODE_ENV=dev \
  -e PG_HOST=prague-poi-db \
  -e PG_PORT=5432 \
  braces/prague-poi-app

docker ps
```

App runs at http://localhost:9002/
