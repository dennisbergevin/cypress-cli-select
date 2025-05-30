# VHS documentation
#
# Output:
#   Output <path>.gif               Create a GIF output at the given <path>
#   Output <path>.mp4               Create an MP4 output at the given <path>
#   Output <path>.webm              Create a WebM output at the given <path>
#
# Require:
#   Require <string>                Ensure a program is on the $PATH to proceed
#
# Settings:
#   Set FontSize <number>           Set the font size of the terminal
#   Set FontFamily <string>         Set the font family of the terminal
#   Set Height <number>             Set the height of the terminal
#   Set Width <number>              Set the width of the terminal
#   Set LetterSpacing <float>       Set the font letter spacing (tracking)
#   Set LineHeight <float>          Set the font line height
#   Set LoopOffset <float>%         Set the starting frame offset for the GIF loop
#   Set Theme <json|string>         Set the theme of the terminal
#   Set Padding <number>            Set the padding of the terminal
#   Set Framerate <number>          Set the framerate of the recording
#   Set PlaybackSpeed <float>       Set the playback speed of the recording
#   Set MarginFill <file|#000000>   Set the file or color the margin will be filled with.
#   Set Margin <number>             Set the size of the margin. Has no effect if MarginFill isn't set.
#   Set BorderRadius <number>       Set terminal border radius, in pixels.
#   Set WindowBar <string>          Set window bar type. (one of: Rings, RingsRight, Colorful, ColorfulRight)
#   Set WindowBarSize <number>      Set window bar size, in pixels. Default is 40.
#   Set TypingSpeed <time>          Set the typing speed of the terminal. Default is 50ms.
#
# Sleep:
#   Sleep <time>                    Sleep for a set amount of <time> in seconds
#
# Type:
#   Type[@<time>] "<characters>"    Type <characters> into the terminal with a
#                                   <time> delay between each character
#
# Keys:
#   Escape[@<time>] [number]        Press the Escape key
#   Backspace[@<time>] [number]     Press the Backspace key
#   Delete[@<time>] [number]        Press the Delete key
#   Insert[@<time>] [number]        Press the Insert key
#   Down[@<time>] [number]          Press the Down key
#   Enter[@<time>] [number]         Press the Enter key
#   Space[@<time>] [number]         Press the Space key
#   Tab[@<time>] [number]           Press the Tab key
#   Left[@<time>] [number]          Press the Left Arrow key
#   Right[@<time>] [number]         Press the Right Arrow key
#   Up[@<time>] [number]            Press the Up Arrow key
#   Down[@<time>] [number]          Press the Down Arrow key
#   PageUp[@<time>] [number]        Press the Page Up key
#   PageDown[@<time>] [number]      Press the Page Down key
#   Ctrl+<key>                      Press the Control key + <key> (e.g. Ctrl+C)
#
# Display:
#   Hide                            Hide the subsequent commands from the output
#   Show                            Show the subsequent commands in the output

# Where should we write the GIF?
Output assets/run-spec-title.gif

# Set fontsize and width/height
Set FontSize 20
Set Width 1600
Set Height 1000

# Set margin + color
Set Margin 50
Set MarginFill "#5f76d9"
Set BorderRadius 10

# Set window bar 
Set WindowBar Colorful
Set WindowBarSize 60

# Set theme 
Set Theme "nord"

# Type a command in the terminal.
Type@150ms "npx cypress-cli-select run"

# Hide the npx loader
Hide

# Run the command
Enter

# Await the cli title and first prompt
Wait+Screen /Cypress-cli-select/
Wait+Screen /Choose to filter by specs, specific test titles or tags/

# Now restart recording
Show
Sleep 1s

# Ensure the first prompt choices are visible on screen
Wait+Screen /Specs/
Wait+Screen /Test titles or tags \(requires cy-grep\)/

# Select all options
Ctrl+a

Sleep 2s

# Confirm 
Enter

# Await the second prompt for titles or tags
Wait+Screen /Choose to filter by specific test titles or tags/
Wait+Screen /Test titles \(requires cy-grep\)/
Wait+Screen /Test tags \(requires cy-grep\)/

Sleep 2s

# Submit titles
Enter

# Await the spec list
Wait+Screen /Select specs to run/
Wait+Screen /todo\.cy\.js/
Wait+Screen /actions\.cy\.js/

Sleep 2s

# Type a search in the prompt
Type@100ms "misc"
# Await the spec list to show search result
Wait+Screen /misc\.cy\.js/

Sleep 2s

# Select spec by pressing tab 
Tab 

Sleep 2s

# Confirm spec
Enter

# Await test list
Wait+Screen /Select tests to run/
Wait+Screen /todo\.cy\.js > example to-do app > displays two todo items by default/
Wait+Screen /actions\.cy\.js > Actions > \.type\(\) - type into a DOM element/

Sleep 2s

# Type a search in the prompt 
Type@200ms "navigation"

# Await the test list to show search result
Wait+Screen /navigation\.cy\.js > Navigation > cy\.reload\(\) - reload the page/
Sleep 2s

# Move down two
Down 
Sleep 1s
Down 
Sleep 1s

# Select title 
Tab 

Sleep 2s

# Remove selected title
Backspace

Sleep 1s

# Type a new search in the prompt
Type@200ms "window"

# Await the test list to show search result
Wait+Screen /window\.cy\.js > Window > cy\.title\(\) - get the title/

# Move down two
Down 
Sleep 1s
Down 
Sleep 1s

# Select new title
Tab

Sleep 2s

# Confirm 
Enter

# Await the cypress run title to show
Wait+Screen /Running Cypress/

