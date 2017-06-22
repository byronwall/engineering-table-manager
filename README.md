# table manager program

This is a simple Electron app that will be used to store tables of information.

## running

The app can be set up locally by installing dependencies with `npm install` and then opening Electron with `npm start`.

There is a VS Code build task set up to run TSC in watch mode if you use the normal build task.  If you are not using VS Code you can simple run `tsc` in the root folder to build the project.

## usage

The end goal of this program is to use it to store arbitrary tables of data (in particular engineering information) and then link them together.  For now, it simply stores tables that you give it and them promptly forgets them on a restart.
