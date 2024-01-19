
async function generatedate(){
    var date = new Date();
        var getYear = date.getFullYear().toString();
        var month = date.getMonth() + 1;
    
        if (month.toString().length > 1) {
            month = month.toString();
        }
        else {
            month = '0' + month;
        }
    
        var day = date.getDate();
        if (day.toString().length > 1) {
            day = day.toString();
        }
        else {
            day = '0' + day;
        }
        var dateInput =  day+month+getYear  ;
    
        let h=date.getHours();
        let minutes=date.getMinutes();
        let s=date.getSeconds();
    
        if(h.toString().length > 1){
            h=h.toString()
        }
        else{
            h = '0' + h;
        }
        if(minutes.toString().length > 1){
            minutes=minutes.toString()
        }
        else{
            minutes = '0' + minutes;
        }
        if(s.toString().length > 1){
            s=s.toString()
        }
        else{
            s = '0' + s;
        }
    
        console.log(dateInput+h+minutes+s);
    
        return dateInput+h+minutes+s;
    }
    
    // generatedate();
module.exports.generatedate = generatedate;