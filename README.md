# FiveM-MongoDB
## Description
This is warpper for [mongodb](https://www.npmjs.com/package/mongodb) npm package. It allows you to use MongoDB in your FiveM server from Lua language.

## Installation

1. Download [latest release](https://github.com/CENSOR1337/FiveM-MongoDB/releases)
2. Add the following lines to your server config:
```
set mongodb_url "mongodb://localhost:27017"
set mongodb_database "fivem_db"
ensure cs_mongodb
```
4. Change `mongodb_url` and `mongodb_database` to your own values.

## Usage 
Callback (Lua):
```lua
MongoDB.findOne({
    collection = "users",
    filter = {
        name = "my_awesome_name"
    }
}, function(bError, result)
    if not(bError) then
        print(json.encode(result))
    end
end)
```

Promise (Lua):
```lua
local result = MongoDB.findOne.await({
    collection = "users",
    filter = {
        name = "my_awesome_name"
    }
})
if (result) then
    print(json.encode(result))
end
```