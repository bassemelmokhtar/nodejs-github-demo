![Node.js CI](https://github.com/bassemelmokhtar/nodejs-github-demo/workflows/Node.js%20CI/badge.svg)
# nodejs-github-demo


# Documentation
CI/CD NodeJs App using Github actions


## Table of Contents

* [Generate and get a copy of your Local Machine SSH key](#generate-and-get-a-copy-of-your-local-machine-ssh-key)
* [Deploy NodeJS App on Server](#deploy-nodejs-app-on-server)
* [Create a CI/CD Pipeline on Github Actions](#create-a-cicd-pipeline-on-github-actions)
* [Setting up the Workflow](#setting-up-the-workflow)


## Generate and get a copy of your Local Machine SSH key

````
cd ~/.ssh/
ssh-keygen -t rsa
cat ~/.ssh/id_rsa.pub
````
here, I am using Linux. if you are on different OS, this will be a bit different. this works well on Linux and Mac.


---

**[⬆ back to top](#documentation)**

## Deploy NodeJS App on Server

Create a new user on your EC2 Server

````
ssh root@SERVER.IP
adduser <username>
usermod -a -G sudo <username>
su — username
````
Run below commands to give that user login access via SSH without a password. then you can easily log in to the server by running ssh <username>@SERVER.IP.
  
````
cd ~
mkdir .ssh
chmod 700 .ssh/
vim ~/.ssh/authorized_keys # here paste your local ssh key as we did earlier
chmod 600 ~/.ssh/*
````
Generate and get a copy of your EC2 SSH key

````
ssh-keygen
cat ~/.ssh/id_rsa.pub #copy the text
````
Now we copied our new user ssh key. just paste it as a Github repository deploy key.


![alt text](https://miro.medium.com/max/2400/1*Ow-_LeYGg0EF55fpQU3CrQ.png)


**[⬆ back to top](#documentation)**

## Create a CI/CD Pipeline on Github Actions

run following command on your local machine which already has the access to EC2 server.
````
cat ~/.ssh/id_rsa #copy the text
````
paste the value into the SSH_KEY secret.
Create other secrets : SSH_HOST,SSH_PORT(default 22),SSH_USERNAME

![alt text](https://miro.medium.com/max/2400/1*y8WNqBga9o9Fk73uw4RQsg.png)

---

**[⬆ back to top](#documentation)**


## Setting up the Workflow

Go to actions

![alt text](https://miro.medium.com/max/2400/1*7OBaYMHJTMJrV1e0AVEV-g.png)

Click the Node.js setup the workflow button. and it will open up a text editor. paste the following yml file content.


````
name: Node Github CI

on:
  push:
    branches:
      - master

jobs:
  test:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [8.x, 10.x, 12.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: npm install and test
      run: |
        npm install
        npm test
      env:
        CI: true

  deploy:
    needs: [test]
    runs-on: ubuntu-latest

    steps:
    - name: SSH and deploy node app
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        port: ${{ secrets.SSH_PORT }}
        script: |
          cd ~/node-github-demo
          git pull
          npm install --production
          pm2 restart node-app

````
