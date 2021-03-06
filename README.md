# Synesthesia 

A colorful visual display driven wirelessly by digital piano input.

# How it works

Digital instruments like pianos can output data about what notes are being played. This data is called MIDI. Using MIDI data as input, we can process and analyze the notes being played in real-time on a computer or smartphone. This data is then used to drive colorful displays over the internet: no wires needed! By combining musical data and Philips Hue colored light bulbs, which can be controlled over your local wifi network, the colorful displays take on a new dimension.

This project uses Google Chrome's built-in MIDI input driver as a cross-platform MIDI interface, and includes a web app that acts as the processor and light driver. The web app is written with Node.js, Express, and client-side javascript. Communication with the Philips Hue bulbs is done with REST calls from both the server and client. 

![alt tag](./images/LightShow2.png?raw=true)

# Demo

Light show: ![alt tag](./images/Youtube_link.PNG?raw=true)

https://www.youtube.com/watch?v=cDrFB9JBSgA


Piano visualization (g7 chord): ![alt tag](./images/G7_chart.png?raw=true)

# Running locally

Download Node and NPM. In this directory (/Synesthesia), run

`$ npm install`

`$ node app.js`

You can use the node server machine as the midi input device, or another computer. 

### Using the server as the MIDI input device

Connect your MIDI input device to your computer

Go to 'http://localhost:3000'

### Using another machine as the MIDI input device

Connect your MIDI input device to you machine (computer, phone, etc).

Go to 'http://server_ip_address:3000/'.

You can find the IP address of your server by typing `ipconfig` on the server machine.

# Adding Philips Hue bulbs

First make sure your bridge is connected to your network and is functioning properly. Test that the smartphone app can control the lights on the same network. Click on "Setup" on the home page to get started. 

The latency of a V2 bridge connected color bulb is around 70ms. V2 bridge and above recommended (V1 bridges are circular in shape, V2 bridges are square in shape with a circular physical button).

# Modes

## Browser Visualization

http://localhost:3000/keys 

Creates a minimalitic browser based visualization of a keyboard (notes are represented like lines). Each note you play is displayed on the on-screen keyboard. The colors of the keys played are based on the colors of Scriabin's colored piano. See https://en.wikipedia.org/wiki/Clavier_%C3%A0_lumi%C3%A8res and https://sound.io/midi/.

## Chord Analysis

http://localhost:3000/lights

Shows different colors based on chords you play.