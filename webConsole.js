/**
* @constructor webConsole is the constructor for a new webconsole object. Note that it depends on mathjs (to work on mathematical operations by default) and JQuery to work (currently this script does not load its own dependencies yet!). The object can be extended through the public methods.
* 
* @param element the identifier for jquery for the element that is going to be the console
* @param background_color the background color of the console (can be changed through css)
* @param text_color the text color for the web command prompt
* @param prompt_symbol the symbol to precede all commands from the user
*/
webConsole = function(element, background_color, text_color, prompt_symbol) {
            
    var html_element = element || "#console";
    var console_txt = "";
    var first = prompt_symbol || ">";
    first += " ";
    var cursor = "";
    var current_line = "";
    var cursorPosition = 0;
    var txt;
    var focusInterval;
    var lastCommands = [];
    var commandPointer;
    var web_console = $(html_element);
    var backColor = background_color || 'black';    
    var textColor = text_color || 'white';
    
    var commands = {};
    
    // hang a 'div' with id 'txt' under the main div    
    web_console.attr('tabindex', 0);    
    web_console.css({
        'position': 'fixed',
        'bottom': '0',
        'background-color': backColor,
        'height': '300px',
        'width': '100%',
        'border': '2px',
        'overflow': 'auto'
    });
    web_console.hover(function() {
      $(this).css("cursor","pointer");
    });
    
    web_console.append('<div id="txt"> </div>');
    txt = $('#txt');
    
    txt.css({
        'padding': '10px 50px 5px 10px',
        'color':textColor,
        'display':'block',
        'width':'100%'
    });
    
    init_console();
    init_commands();
    update_line();   
    
    
    function init_console(){
        web_console.focus(console_focus);
        web_console.blur(function(){
            clearInterval(focusInterval);
            cursor = ""; 
            update_line();
        });
        // keydown because keypress ignores arrows
        web_console.keydown(console_arrows);
        web_console.keypress(console_input);
        
    }
    
    function init_commands(){
        commands["h?"] = {
            'description': "The help function gives a list of all methods available",
            'method' : function(args){
                
                var message = "";
                message += "=======================\n == Welcome to webConsole! ==\n=======================\n \n These are the current known commands: \n \n";
                
                Object.keys(commands).forEach(function(key) {
                    var val = commands[key];
                    message += (" " + key + " : " + val.description + '\n');
                });
                
                message += "\n This is the default method for adding new commands to the console: \n \n add_command(key, command) : adds a new command to the console where 'key' is the name of the command and 'Command' is an object that contains at least a 'description' and a 'method' (usually, 'method' will handle the additional parameters that can be present). The rest of the input is given by the parameter 'args' (an array of input split on spaces) \n \n";
                
                message += "Lastly, this console will allow you to perform math direclty by using MathJS, so you can go ahead and try that too!";
              log(message);   
            }
        };
        
        commands["echo"] = {
            'description' : 'Echos the given string back to the user as is',
            'method' : function(args){
                log(args.join(" "));
            }            
        };
        
        commands["cls"] = {
            'description' : 'Clears the console',
            'method' : function(args){
                console_txt = "";
            }
        }
    }
    
    function log(text, noReplace){
        
        text = text || "";
        if(!noReplace) text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
        console_txt += text + '<br />';
        update_line();
    }
    
    function update_line(){
        if(cursorPosition === 0){
            txt.html(console_txt + first + current_line + cursor);
        }
        else{
            txt.html(console_txt + first + current_line.slice(0,cursorPosition) + cursor + current_line.slice(cursorPosition));
        }
    }
    
    
    function console_focus(){
        var state = true;
        focusInterval = setInterval(function() {
            cursor = (state) ? "|" : "";
            state = !state;
            update_line();
        }, 500);
    }
    
    function console_input(key){
        switch(key.which){
            case 8: 
                var temp = current_line;
                if(cursorPosition === 0)
                    current_line = current_line.slice(0,-1);
                else
                    current_line = current_line.slice(0,cursorPosition-1) + temp.slice(cursorPosition);
                break; //backspace
            case 13://enter
                parse_input(current_line);
                break; 
            default: 
                current_line = (cursorPosition === 0)? current_line + String.fromCharCode(key.which) : current_line.slice(0, cursorPosition) + String.fromCharCode(key.which) + current_line.slice(cursorPosition);
        }
        update_line();
       
        var height = web_console[0].scrollHeight;
        web_console.scrollTop(height);
    }
    
    function parse_input(input){
        log(first + input);
        
        // allow to use the arrow buttons to scroll through old commands
        lastCommands.push(input);
        commandPointer = lastCommands.length-1;
        
        args = input.split(" ");
        var cmd = commands[args.shift()];
        if(cmd){
            try{
                cmd.method(args);
            }
            catch(e){
                log("<span style='color:red'>ERROR: " + e.message+ "</span>");
            }    
        }
        else if(input !== ""){
            var result;
            try {
                result = math.eval(input);
            }
            catch(e) {
                result = "";
            }
            if (result==="") log("Unknown command. Type h? for help");
            else log(result, true);
        }
       
        current_line = "";
        cursorPosition = 0;
        update_line();
        
                
    }
    
    function console_arrows(key){
        if(key.which === 8) // stop going back on 'backspace', delete and . and pass command to input handler
        {
            key.preventDefault();
            console_input(key);
        }
        
        if(key.which === 46)
        {
            var temp = current_line;
            if(cursorPosition !== 0){
                if(cursorPosition === -1)
                    current_line = current_line.slice(0,-1);
                else{
                    current_line = current_line.slice(0,cursorPosition) + temp.slice(cursorPosition+1);
                    
                }
                cursorPosition++;
            }
        }
        if(key.which >= 37 && key.which <= 40){
            switch(key.which){
                case 38: 
                    current_line = lastCommands[commandPointer] || ""; 
                    commandPointer = Math.max(0, --commandPointer);
                    break; //up arrow
                case 40: 
                    commandPointer = Math.min(lastCommands.length-1, ++commandPointer);
                    current_line = lastCommands[commandPointer] || ""; 
                    break; //down arrow
                case 39: 
                    cursorPosition = Math.min(0, ++cursorPosition);
                    break; //right arrow
                case 37: 
                    cursorPosition = Math.max(-1 * current_line.length, --cursorPosition) || 0;
                    break; //left arrow
            }
            update_line();
            
        }
        
    }
    
    this.add_command = function(key, command, override) {
        if (!override && commands[key]) 
            return "command already exists. If you wish to override, add true as the third parameter to this function";
       
        commands[key] = command;
        return "command added successfully";
    };
    
    webConsole.prototype.log = function(text){
        log(text);
    }    
}