# Animall-API

### Prerequisites
  ```bash
    npm install -g firebase-tools
    npm install express
    npm install cors
    npm install --save geofire-common
  ```
### Testing Locally
  * Start the Local Emulator by
  ```bash
    firebase emulators:start
  ```
  
  * Test the API using postman collection
  
    * Sample POST Request
      
      Url : http://localhost:5001/animall-milkcenter-api/us-central1/app/
      
      Body :
      ```
        {
            "name" : "Siri toffee Milk Center",
            "lat" : 27.6094,
            "lng" : 75.1398,
            "timing" : "2 PM - 5 PM"
        }
      ```
      ![Animal POST](https://github.com/Vaibhavsaharan/Animall-API/blob/master/images/Animall-POST.png)
      
     * Sample GET Request
      
        Url : http://localhost:5001/animall-milkcenter-api/us-central1/app/user

        Body :
        ```
          {
              "lat" : 26.449896,
              "lng" : 74.639915,
              "radius" : 200
          }
        ```
       ![Animal GET](https://github.com/Vaibhavsaharan/Animall-API/blob/master/images/Animall-GET.png)
      
