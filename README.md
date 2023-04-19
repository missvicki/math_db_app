# MATH_DB_APP

## Table Of Contents:

- Introduction
- Requirements
- Installation
- Configuration
- Database structure
- Steps to run and build the code
- Repositories
- Required Credentials

## Introduction

The Math Department Administration Database App displays the entire student database through graphs displayed on web page via query on certain tables.

## Requirements

aniso8601==7.0.0  
click==8.1.3  
Flask==2.2.2  
Flask-GraphQL==2.0.1  
Flask-SQLAlchemy==2.5.1  
graphene==2.1.9  
graphene-sqlalchemy==2.3.0  
graphql-core==2.3.2  
graphql-relay==2.0.1  
graphql-server-core==1.2.0  
greenlet==1.1.2  
itsdangerous==2.1.2  
Jinja2==3.1.2  
MarkupSafe==2.1.1  
mysqlclient==2.1.1  
promise==2.3  
Rx==1.6.1  
singledispatch==3.7.0  
six==1.16.0  
SQLAlchemy==1.4.40  
Werkzeug==2.2.2  

## Installation

* Install Docker: https://docs.docker.com/get-docker/
* To verify that docker is pulling images and running as expected: ```docker run hello-world```
* Clone repository: https://gitlab.oit.duke.edu/colab-insomnia-dev/math_db_app
* Navigate to folder: ```cd /math_db_app```
* To build container: ```docker-compose build```
* To start container: ```docker-compose up```
* Verify that server is up and running: http://localhost:4000/base in browser

## Other Commands

* To run container in the background (detached mode) and keep terminal clear: ```docker-compose up -d```
* To display log output: ```docker-compose logs```
* To stop container: ```docker-compose down```

## Configuration

Requires python and node.

pip install flask
cd client && npm install

## Database Structure

Database Schema: development

Classes
rost
students_lim

## Steps to run and build the code
Prerequistes: 

Docker After downloading Docker.dmg, run the following commands in a terminal to install Docker Desktop in the Applications folder:
 
sudo hdiutil attach Docker.dmg

sudo /Volumes/Docker/Docker.app/Contents/MacOS/install

sudo hdiutil detach /Volumes/Docker

Python : https://www.python.org/downloads/  :  Version 3 or above

##Run and Build The Code 

/venv/bin/activate 

docker compose up


## Required Credentials

      MYSQL_USER: math_user
      MYSQL_PASSWORD: notarealpassword
      MYSQL_DATABASE: development
