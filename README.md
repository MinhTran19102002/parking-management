## How to install

### Backend
```
cd ./backend
yarn install
yarn dev
```

### Frontend
```
cd ./frontend
yarn install
yarn dev
```
Result: https://localhost:5173/

### HLS server
```
cd ./hls-server
docker compose -f ./deployment/docker-compose.yml up -d --pull never
```

### AI server
```
cd ./service-in-out
python app.py
```

## Document
- [General](https://1drv.ms/w/s!ApgtvXo0OGIMjPoeHpMO43nBAH-nIA)
- [Backend](https://1drv.ms/w/s!ApgtvXo0OGIMiIFMB04yW73IkzwT8A)
