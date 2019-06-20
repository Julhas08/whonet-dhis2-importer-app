/*
* Add leading zero
* Formate date column as yyyy-mm-dd for eventDate
* Formate any other columns where has '/'
* Return default date if the format is ok
*/ 
function AddLeadingZero(num) {
  console.log("Number:", num);
  return (num < 10 ? '0' : '') + num;
}

export function formatDate(date) {
  let [month, day, year] = date.split('/');
  let matchResult = date.match(/\//g);
  if(matchResult !== null){
    if ( matchResult.length > 0 ) {
    return year + '-' + AddLeadingZero(month) + '-' + AddLeadingZero(day);  
    } 
  } else {
    return date;
  } 
}

