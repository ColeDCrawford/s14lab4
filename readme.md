## Lab 4

Welcome! This week we will be passing data to the client and building data visualizations with d3.

1.  Much of the setup for this lab is already done - you just need to get the app working on your machine. Follow this tutorial to get things ready:

    1. Checkout '.env' (setup with `pip install python-dotenv`)
        + Import and setup in 'app.py'
        + Working into [Heroku](https://devcenter.heroku.com/articles/config-vars)
    
    2. Setup DB
        + Open psql in terminal: `psql postgres`
            + psql: `CREATE DATABASE homework_users_db;`
            + psql: `\c homework_users_db`
        + Seed from 'predefined_users.csv'
            + First take a look at './data/seed_db.py' and update user if not 'postgres'
            + Run: `python data/seed_db.py`
            + Confirm in psql: `SELECT * FROM homework_users;`
    
    3. Take a look at the new route '/load_data'
        + Visit http://127.0.0.1:5000/load_data in the browser and become familiar with the format.
        + This the route we will be calling from in the client side of our application to return db data.
        
2. [D3.js](https://github.com/d3/d3/blob/master/API.md)
    
    + Code along! - The code will be included in './static/js/'
    + Your tasks:
        + Create a 'donut.js' class and build a donut chart that represents the different programing languages, and shows the results in the center when hovering.
        + Create a 'scatter.js' class build a scatterplot that represents the years of experience on the x-axis, the HW1 hours on the y-axis, and encodes the age in the circle radius.
        + EC (+1 - +4) - add events and transitions to the visualizations that improve a user's exploration experience.
