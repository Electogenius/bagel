let b=require("./src/.")
let e=`
47
`
.replace(/(;.+$|~.*?~|\n)/gm,"").match(/[0-9a-f]/ig).join``
try{
    b.run(e,["Go North"])
}catch(e){console.log(e)}