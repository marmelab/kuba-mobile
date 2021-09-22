# kuba-mobile

Kuba react-native application.

## System setup

Clone the repo with `git clone [REPO_URL]` command
Switch to the project's root directory in terminal
Install the dependencies by running `yarn install`
Once, 'yarn install' is completed, run `yarn start` to start the expo and react-native server
If it shows a QR code on the terminal as a result of 'yarn start' command, then you are good to go!

## ENV

You have an environment file to declare `.env`.
You can use the `.env.sample` file as a starting point by renaming it .env
This file must contain a variable `API_URL` which is the address of your data provider
Also need a variable `GATEWAY_URL` which is the address of your gateway

## Mobile setup

Install 'Expo' application on your android/iOS device.
Scan the QR code shown on the terminal.
Once the QR code is successfully scanned, it will take few seconds to load and render the app.
