Arcanist 'Unit Test' Setup 
=====

> Goal: ensure that all diffs have had an npm script successfully executed prior to generation of the diff.

We use `arc unit` rather than `arc lint` as arc lint invokes a command on **every file**. 
As we want to run a script **once** per diff generation, using `arc unit` makes more sense.

 If the npm script returns a non-zero return value, that counts as a 'unit test failure', and the output of the script is displayed.
 If the npm script returns zero, then the 'unit test' passes and `arc diff` will continue.

Usage
-----

- Copy this whole folder (including the arcanist/ parent folder) into your project
- Edit .arcconfig to look like this:

```
{
  ..... existing items ....
  "load" : ["arcanist/NpmRunScript"],
  "unit.engine" : "NpmRunScript",
  "npm.run.script": "check-all"
}
```
- the `npm.run.script` part is the name of the npm script to run.
- Example above will run `npm run check-all`
