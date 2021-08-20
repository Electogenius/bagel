# 🥯

a bad but simple-ish golfing language with an unusual approach 

not exactly sure why I named it bagel

## The idea that led to this entire thing:
"Hmm, instead of using a character to mark the end of, say, a string, why not specify the length of the string at the start? Oh wait the length specifier will also be 1 byte so nothing will change...

Wait, then what if I specify the length of the string *in* the byte marking the start... I could use half a byte for it, strings over 16 bytes can have a different system"


Also golfing languages usually use stacks but they make me feel uncomfortable so I used a tape (with some stack-lang-like features)

More info [in the wiki](https://github.com/Electogenius/bagel/wiki)