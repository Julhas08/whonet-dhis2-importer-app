/*
* Add leading zero
* Formate date column as yyyy-mm-dd for eventDate
* Formate any other columns where has '/'
* Return default date if the format is ok
*/ 
function AddLeadingZero(num) {
  let number = Number.parseInt(num, 10);
  return (number < 10 ? '0' : '') + number;
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

