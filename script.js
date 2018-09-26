/******************************
*Variables and data types
*/
/*
var firstName = 'John';
console.log(firstName);

var lastName = 'Smith';
var age = 28;

var fullAge = true;
console.log(fullAge);

var job;
console.log(job);

job = 'Teacher';
console.log(job);
// Variable naming rules
var _3years = 3;
var johnMark = 'John and Mark';
var if = 23;
*/


/******************************
*Variables mutation and type coercion
*/
/*
var firstName = 'John';
var age = 28;


// Type coercion
console.log(firstName + ' ' + age);

var job, isMarried;
job = 'teacher';
isMarried = false;

console.log(firstName + ' is a ' + age + ' years old ' + job + ' Is he married? ' + isMarried);

// Variable mutation
age = 'twent eight';
job = 'driver';

alert(firstName + ' is a ' + age + ' years old ' + job + ' Is he married? ' + isMarried);

var lastName =prompt('What is his last Name?');
console.log(firstName + ' ' + lastName);
*/




/***************************************************
* Basic operators
*/
var now, yearJohn, yearMark, ageJohn, ageMark; 
now = 2018;
/*
// Math operators
yearJohn = now - 28;
yearMark = now - 33;
ageJohn = 28;
ageMark = 33;

console.log(yearJohn + ' ' + yearMark);

console.log(now + 2);
console.log(now * 2);
console.log(now / 2);
console.log(now - 2);

// Logical operators
var johnOlder = ageJohn < ageMark;
console.log(johnOlder);


// typeof operator
console.log(typeof johnOlder);
console.log(typeof ageJohn);
console.log(typeof 'Mark is older then John');
var x;
console.log(typeof x);
*/




/*****************************************
* Operator precedence
*/

var now = 2018;
var yearJohn = 1989;
var fullage = 18;

// Multiple operators
var isFullAge = now - yearJohn >= fullage; // true
console.log(isFullAge);

// Grouping
var ageJohn =  now - yearJohn;
var ageMark = 35;
var average = (ageJohn + ageMark) / 2;
console.log(average);

// Multiple assignments
var x, y;
x = y =(3 + 5) * 4 - 6; // 8 * 4 - 6 // 32 - 6 // 26
console.log(x, y);


// More operators
x*= 2;
console.log(x);
x+= 10;
console.log(x);
x++
console.log(x);








































