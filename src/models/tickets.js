const mongoose =  require('mongoose');

const schema = new  mongoose.Schema({
  id: String,
  rt: Boolean,
  status:String, // paid peinding no-paid
  date:  { type: Date, default: Date.now },
  passengers:[{
    size:String, // adult, kid, baby
    id:Number,
    name:String,
    lastname:String,
    email:String,
    telephone:Number,
    age:Number,
    percentage:Number,
    total:Number,
  }],
  flights:[
    {
      startCity:String,
      endCity:String,
      miles:Number,
      plane:String,
      startDate:Date,
      endDate:Date,
      price:Number,
      direct:Boolean 
    }
  ]

});

const Ticket = mongoose.model("Ticket",schema);

module.exports ={
  Ticket
}