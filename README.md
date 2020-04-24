# coge

[![build status](https://img.shields.io/travis/cogelab/coge/master.svg)](https://travis-ci.org/cogelab/coge)
[![npm version](https://img.shields.io/npm/v/coge.svg)](https://www.npmjs.com/package/coge)

> An efficient code generator.

`coge` is a fork of `hygen`. It aims to provide more flexible and efficient code generator tool.

`hygen` is the simple, fast, and scalable code generator that lives _in_ your project.

## Features

✅ Build ad-hoc generators quickly and full on project scaffolds.  
✅ Local generators per project (and global, if you must)  
✅ Built-in scaffolds to quickly create generators  
✅ Full logic templates and rendering  
✅ Prompts and flows for taking in arguments  
✅ Automatic CLI arguments  
✅ Adding new files  
✅ Injecting into existing files  
✅ Running shell commands  
✅ Super fast, constantly optimized for speed  
✅ __Support deep attribute options with CLI arguments__  
✅ __Automatic attribute value type inference__  

## Quick Start

Coge can be used to supercharge your workflow with [Redux](http://www.coge.io/redux), [React Native](http://www.coge.io/react-native), [Express](http://www.coge.io/express) and more, by allowing you avoid manual work and generate, add, inject and perform custom operations on your codebase.

If you're on macOS and have Homebrew:

```
$ brew tap cogelab/tap
$ brew install coge
```

If you have node.js installed, you can install globally with `npm` (or Yarn):

```
$ npm i -g coge
```

If you like a no-strings-attached approach, you can use `npx` without installing globally:

```
$ npx coge ...
```

For other platforms, see [releases](https://github.com/cogelab/coge/releases).

Initialize `coge` in your project (do this once per project):

```
$ cd your-project
$ coge generator init
```

Build your first generator, called `mygen`:

```
$ coge generator new mygen

Loaded templates: _templates
  generated: _templates/mygen/new/hello.ejs.t
```

Now you can use it:

```
$ coge mygen gen

Loaded templates: _templates
  generated: app/hello.js
```

You've generated content into the current working directory in `app/`. To see how is the generator built, look at `_templates` (which you should check-in to your project from now on, by the way).

You can build a generator that uses an interactive prompt to fill in a variable:

```
$ coge generator cli mygen

Loaded templates: _templates
  generated: _templates/mygen/cli/hello.ejs.t
  generated: _templates/mygen/cli/prompt.js
```

Done! Now let's use `mygen`:

```
$ coge mygen cli
? What's your message? hello

Loaded templates: _templates
  generated: app/hello.js
```
