# webConsole

[webConsole](https://github.com/shoogervorst/webConsole) was created during the course of a day out of general interest. It is not at all supported, might not be worked on at all (by me at least) and might be of no use to anyone, but it is accessible for you should you want to have a simple console environment on your website.


## Usage
### Initialization
If you want to start using webConsole, all you need on your website is a div element.

```
var web_console = new webConsole();
```

This is the easiest way to start using *webConsole*. It will assume you have a `<div id="console">` somewhere on you page where you want the console to appear. It will create a default console with black background and white font. If you want to give it a different layout or link it to a different element, you can use:

```
var web_console = new webConsole(jqueryIdentifier, background_color, text_color, prompt_sign);
```
for example, to create a dark gray prompt with yellow text on the div with **id="cmd"** using a `$`-sign instead of `>` for the prompt, we would say:

```
var web_console = new webConsole("#cmd", "DarkSlateGray", "Yellow", "$");
```
### Defaults
By default, the console does not offer much. It has 3 methods available:
* h? : a help function that lists all the commands
* echo : the all-familiar command that repeats what you feed it
* cls : an option to clear the screen

Aside from that, you can use the up and down arrows to scroll through commands. The console will also attempt to interpret what you feed it as mathematical expressions, by using [mathjs](http://mathjs.org/). for example, the following interactions are possible:

```
> 2 + 2
4
> echo stop repeating me
stop repeating me
```

### Adding methods
The power of *webConsole* lies in that it is extendible. You can easily add your own methods and make this console do whatever you want it to do. In order to do so, after initialization, you can use the method `add_command`. This function wants a `key` which is the way the command will be called and an `command`-object that specifies the description and the method.

the method gets 1 parameter that contains all the arguments that the user passes it.

Here is a simple example of a function that does almost the same as `echo`:

```
var web_console = new webConsole(, 'DarkSlateGray', 'yellow'); //takes the default '#console'
var key = "whisper";
var command = {
    'description':'whispers what you give it', 
    'method' : function(args)
        {
            web_console.log('[whispers]<i> ' + args.join(" ") + " </i>[whispers]");
        }
    };
web_console.add_command(key, command);
```

> Notice that `log` is the only other exposed command currently! It allows you to write to the console what you want to do. 

## Possible problems
This list is by no means exhaustive (as you might have guessed)

* webConsole creates a div with **id = "webC_txt"**. If you already have that id on your page, it will mess things up.
* webConsole will add the attribute **tabindex="0"** to the div you assign as the console. This might make things difficult for you if you also have a tabindex specified somewhere 

## Dependencies

* [JQuery](jquery.com)
* [mathjs](mathjs.org)


## Todos

 - Check if dependencies are loaded, otherwise load in library
 - Validate the addition of new commands for the console
 - add method to remove commands from console

## License
----

GNU
