


<p align="center">
  <img width="460" height="300" src="https://i.ibb.co/DtGZBFY/stacks.png">
</p>


Stacks
======
A website where you can adverstise your stack technologies

<p align="center">
  <img width="100%" height="300" src="https://i.ibb.co/6F2rnFq/Screen-Shot-2020-02-14-at-3-12-32-PM.png">
</p>

Description
======
My first mern project with a bunch of bloated component and no testing....
100% sure they are bugs around so if anyone wanted to reduce the code to make it more 
Readable 

feel free to hit me up with a merge

Otherwise Visit.
[Stacks](https://mylogin32.herokuapp.com/)

Installation
======

### 1 - MONGO
Make sure you have mongo set up 
https://www.mongodb.com/
Go into config and add your mongo database

### 2 - google cloud storage 
head over to  [www.google-cloud-storage.com](https://cloud.google.com/storage/?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-e-dr-1008076&utm_content=text-ad-none-any-DEV_c-CRE_79747411567-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+%7C+US+%7C+en+%7C+EXA+~+Google+Cloud+Storage-KWID_43700007031545851-kwd-11642151515&utm_term=KW_google%20cloud%20storage-ST_google+cloud+storage&gclid=CjwKCAiAp5nyBRABEiwApTwjXjPvLWvMS4jDauG57C8A7HqwDccgklajEmyDmg8K0mewf59jeBoLnhoC7zQQAvD_BwE)

### 3 - enable Google Cloud Storage api  (FOR PICTURE UPLOADING)
- create an api key 
- go to the google folder inside the mern project where nodejs is located and place your key within
  there

- you also need to put your heroku website in the domain 
  otherwise google will give an error claiming it needs a website 
  
### IMPORTANT FOR GOOGLE CLOUD STORAGE MAKE SURE YOU SET UP ***Configuration and Config Vars**** with google cloud storage!
    
    HEROKU NEEDS TO FIND YOUR SECRET KEY FOR GOOGLE HEAD OVER TO 
    https://devcenter.heroku.com/articles/config-vars for a little tutorial
    
    - go to personal 
    - your app
    - settings 
    - scroll down to config vars 
    - reveal Config Vars
    - put in key this -> GOOGLE_APPLICATION_CREDENTIALS
    - put in value this -> secret.json
    
    put in whatevever for heroku to find that secret.json 
    
    (THIS IS REALLY IMPORTANT FOR FILE UPLOADING)
    
### finally deploy to heroku

### IF YOU'D LIKE TO KNOW HOW A MERN APPLICATION IS DEPLOYED

 - Go to nodejs package.json
 - add this to your script
 - "scripts": {
    "start": "node index.js",
    "heroku-postbuild": "cd client && npm install && npm run build"
  },
 - GO TO YOUR CLIENT -> package.json
 - and add this before your dependencies
  "proxy": "http://localhost:5000",
 
