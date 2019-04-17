const db  = require('./models');
const auth  = require('./modules/auth')
db.group.create(
    [{
        name:"admin",
        description:"admin group"
    },
    {
        name:"user",
        description:"user group"
    }],
    (err,data)=>{
        if(err){
            console.log("errors group creations")
        }
        console.log(data)
        for(let i=0; i < data.length; i++){
            if(data[i].name==='admin'){
                auth.genPassword('password',(err,password)=>{
                    if(err){
                        console.log('error in fetching password')
                    }else{
                        db.users.create({
                            name:"admin",
                            email:"admin@admin.com",
                            password:password,
                            active:true,
                            groupId:data[i]._id
                        },(err,userdata)=>{
                            if(err){
                                console.log("errors found in user creation");
                            }
                            else{
                                console.log(userdata);
                            }
                        });
                    }
                    
                })
                
            }
        }
        
    }
)

