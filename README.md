docker commands for production:
docker build . -f nginx/Dockerfile -t --build-arg SOCKET_URL=http://3.144.168.182:3001 barkin94/chess-frontend
docker run -d -p 80:80 barkin94/chess-frontend