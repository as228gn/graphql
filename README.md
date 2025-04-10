# Project Title
assignment-api-design

# Implementation type
GraphQL

# Links 
- [Production url](https://cscloud6-21.lnu.se/Graphql/)
- [Documentation url](https://documenter.getpostman.com/view/31224856/2sB2cVehDq)

## Description
### GraphQL API for Movies
This GraphQL API allows you to:  
Retrieve information about movies and their actors  
Check if a movie is popular by viewing its rental count  
Perform full CRUD operations on movies, provided you include a valid Bearer token (obtained upon logging in)  

### Getting Started
The best way to explore and test the API is through the GraphQL [Sandbox](https://cscloud6-21.lnu.se/Graphql/), along with the documentation provided in Postman.  

### Authorization
To access protected endpoints (like creating, updating, or deleting movies), you'll need to set a Bearer token in the Sandbox:  
Click "Settings" next to the endpoint in the top-left corner.  
Under "Shared Headers", set:  
Header Key: Authorization  
Value: Bearer <your_jwt_token>  
Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## Technologies Used
- ApolloServer - an open-source library for building a GraphQL server in Node.js
- Azure Database for MySQL flexible server - a managed database service by Microsoft Azure that runs MySQL (an open-source relational database).

## Installation Instructions
   - **Steps:**
     - **Clone the Repository:** Instructions to clone the project from GitHub.

     - **Navigate to the Project Directory:** Change directory to the cloned repository.
     - **Install Dependencies:** Install necessary packages using `npm install`.
     - **Configure Environment Variables:** Set up the `.env` file with required environment variables.  
     ```env   
     PORT=8080  
     DB_HOST=localhost  
     DB_USER=root  
     DB_PASSWORD=&lt;your password&gt;  
     DB_NAME='sakila'
     ```  
     - **Set up your database** 
     Set up MySQL Workbench and populate it with sakila testdata (provided in a zip file) for further instructions visit [MySQL Workbench](https://www.mysql.com/products/workbench/).  
     Add an additional table user with columns id_user, username, password.
### Testing with Postman:
- Import the Collection  
Download the `API-Assignment.postman_collection.json` file from the repo. Import it to postman.
- Set Up Environment Variables  
Download the `GraphQl.postman_environment.json` file from the repo. Import it to postman.
- Run the Tests  
Press run and then Run API-Assignment.