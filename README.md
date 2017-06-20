# table manager program

This is a simple web app that will be used to store tables of information.

## running

The app can be set up locally by installing dependencies with `npm install` and then running the server with `npm start`.  This will create a local web server on port 8080.

If you want to use Gulp to monitor for changes and recompile the Typescript use `npm run watch`.  This also copies the index page over.

## usage

The end goal of this program is to use it to store arbitrary tables of data (in particular engineering information) and then link them together.  For now, it simply stores tables that you give it and them promptly forgets them on a restart.
