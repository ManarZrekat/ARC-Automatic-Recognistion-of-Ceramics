# ARC-Automatic-Recognistion-of-Ceramics

 My final project for my degree was in collabaration with the archealogical lab at my university.
 The app identifies archeological pottery’s type. The application aim is to make the identification process easier, Usually, to identify the type or the period of a pottery piece, the archeologist needs to go through the following steps in order to make the final decision:
 1. color of the piece
 2. texture
 3. the circumference
 4. any type of decoration 
 
 The app includes two features, a search bar that retrieves images of pottery stored in the database relevant to the user’s input, and an identification process.
 
 **Architecture** 
 
 We used Ionic-5-Angular for building the client side of the application. 
 
 Server side: we trained a Pytorch model in python using google cloud VM, and we used Flask as an API, we deployed the API on Heroku, and we send the post requests to the url given to us by heroku.
 
 ![image](https://user-images.githubusercontent.com/93828878/156892786-3ff43049-0079-40a6-9a14-d5c7cc30ff0f.png) 
 
 # *Getting Started* 
 ●	Run npm install from the project root. 
 
 ●	To install the Camera plugin use "npm install -g cordova ionic" 
 
 ●	Deploy the firebase to the application by following the instructions in this link: https://alligator.io/angular/deploying-angular-app-to-firebase/ 
 
 ●	Use "ionic server" to open the application in development mode.
 
 # *App preview* 
 
 ![image](https://user-images.githubusercontent.com/93828878/156893283-c796268a-1ddf-491f-8448-283703324431.png) 
 
 ![image](https://user-images.githubusercontent.com/93828878/156893318-94cc741d-6d4b-4bb9-b359-de76690e4812.png) 
 ![image](https://user-images.githubusercontent.com/93828878/156893338-4446ad3e-8c9c-4ab2-9691-370493c91771.png) 
 
 ![image](https://user-images.githubusercontent.com/93828878/156893330-565dff95-9837-4afa-9124-00d444ea379a.png) 
 ![image](https://user-images.githubusercontent.com/93828878/156893349-a5210f3e-9b06-4d81-b407-2f4278f588ae.png)
 ![image](https://user-images.githubusercontent.com/93828878/156893354-1e920424-2de0-45ba-be6a-f00edffe8e31.png) 
 ![image](https://user-images.githubusercontent.com/93828878/156893359-f1daa824-5fe7-406a-955c-489711c6cca4.png)
