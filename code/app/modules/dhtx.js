module.exports = {

    genRibbonJson : (type)=>{
       
		let ribbon = [];
    
        let userBlock = {
            id: "users",
            text:"Users",
            items: [
                {
                    type:"block",
                    text: "Users",
                    text_pos: "bottom", 
                    mode: "cols", 
                    list: [
                        {
                            type: "button", 
                            id:"userlist", 
                            text: "Users" , 
                            isbig: true, 
                            img: "/coperative.png"
                        },
                        {type:"buttonCombo", id: "userco",text:"", items: [
                            {value: "1", text: "Active", selected: true},
                            {value: "2", text: "Suspended"}
                        ]},
                        {type: "button", id:"edit", text: "Create user" , img: "/exportcsv.png"},
                        
                    ]
                },
                {
                    type:"block",
                    text: "create",
                    text_pos: "bottom", 
                    mode: "cols", 
                    list: [
                        
                        {type: "button", id:"approve", text: "Activate" , img: "/exportcsv.png"},
                        {type: "button", id:"disapprove", text: "Supspend" , img: "/exportcsv.png"},
                        {type: "button", id:"reset", text: "Reset Password" , img: "/exportcsv.png"},
                       
                    ]
                }
            ]
        };
        let uploadBlock = {
            id: "upload",
            text:"Uploads",
            items: [
                {
                    type:"block",
                    text: "uploads",
                    text_pos: "bottom", 
                    mode: "cols", 
                    list: [
                        {
                            type: "button", 
                            id:"uploadlist", 
                            text: "Uploads" , 
                            isbig: true, 
                            img: "/coperative.png"
                        },
                        
                        {type: "button", id:"upload", text: "Start Upload" , img: "/exportcsv.png"},
                        {type: "button", id:"uploadDelete", text: "Delete" , img: "/exportcsv.png"},
                    ]
                }
            ]
        }
        if( type === 'admin'){
            ribbon.push(userBlock);
        }
        ribbon.push(uploadBlock);
        return JSON.stringify(ribbon);
    }
    
// end of exports
}