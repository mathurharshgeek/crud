const express=require('express');
const path=require('path');
const ejs=require('ejs');
const moongose=require('mongoose');
moongose.set('useFindAndModify', false);
const app=express();
const url="mongodb+srv://cke_bakery:test@cluster0.au2sh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
moongose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
console.log("database has been connected") ;   
}).catch(()=>{
    console.log("can not connect to database");
})  
const PORT=process.env.PORT || 80;
const sc=moongose.Schema({
    name:String,
    mobile:Number,
});
const mod=moongose.model('done',sc);
app.set('views',path.join(__dirname,'/views'))
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('hey');
});

app.get('/list',(req,res)=>{
    mod.find((err,docs)=>{
        if(!err){
            res.render('list',{list:docs})
        }
        else{
            console.log("erore in getting data");
        }
    })
});
app.get('/:id',(req,res)=>{
    mod.findById(req.params.id,(err,doc)=>{
        if(!err)
        {
            res.render('update',{employee:doc})
        }
        else{
            console.log("can not get data of this user");
        }
    })
});
app.get("/delete/:id",(req,res)=>{
    mod.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/list');
        }
        else{
            console.log("can not delete data");
        }
    })
})
app.post('/',(req,res)=>{
    if(req.body._id=='')
    {
        insert(req,res);
    }
    else{
        update(req,res);
    }
})

    function insert(req,res){
    let data=new mod();
    data.name=req.body.name;
    data.mobile=req.body.mobile;
    data.save().then(()=>{
        console.log("data has been inserted");
   res.redirect('/list'); 
    }).catch(()=>{
        console.log("errore im inserting data");
    })

};
function update(req,res){
    mod.findByIdAndUpdate({_id:req.body._id},req.body,{new:true},(err,doc)=>{
        if(!err){
            res.redirect('/list');
        }
        else{
            console.log("can not update data");
        }
    })
}
app.listen(PORT,()=>{
    console.log("app is running on port 80")
})