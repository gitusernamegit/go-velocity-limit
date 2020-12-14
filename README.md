
#Run app using docker

Make sure docker is installed on your machine and running Linux distribution

"run-app.bat" will create new docker image and will run the app


#Run app from local directory

Make sure npm and go is installed on your machine

git clone https://github.com/gitusernamegit/go-velocity-limit.git

Run cmd from ~/frontend directory
npm install react-scripts@4.0.1 typescript @types/node @types/react @types/react-dom @types/jest  react-redux @types/react-redux @types/redux redux-thunk @types/redux-thunk jest -D --silent

npm run build

This should create production ready web bundle "build" directory

Copy "build" directory into ~/backend folder

Run cmd "go run" from ~/backend folder



#Run tests

Backend
From ~/backend dorectory run "run-tests.bat" 

Frontend
From ~/frontend dorectory run "npm test"


#Web App
The web app should be avaialbe at http://localhost:8092

