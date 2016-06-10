To use this as a developer:
* Clone it from git.

You will need to load this in chrome as a developer extension. 

Launch the app this way: 
https://developer.chrome.com/apps/first_app#five - pointing it at the Bounce directory.
---
Where you can, please stick to https://google.github.io/styleguide/javascriptguide.xml.

Test using the Jasmine test specs - yes there are gaps.
---
UI modifications

Use jquery where possible - it is often simpler than the closure equivalent.
Closure is what blockly is based upon - but can lead to very heavyweight code compared to the jquery alternative.

---
Changing libraries

If you need to change the goog dependancies, or blockly version this is a bit trickier. 
You will need standard gnu loadout + a jre. Use GOW on windows.

Use update_libs.sh - and then you will need to commit the compressed output.
