# How to Determine Leap Year

![Alt text](images/rf.png)

This rule model determines if a year is a leap year: 

![](images/sshot-36.png)

This sheet determines the number of days in the month taking into consideration whether the years is a leap year (as determined by the previous rule sheet):

![](images/sshot-37.png)

This sheet generates the string form of the date of the last day of the month by concatenating
the various components with the ‘+’ operator and also determines what day of the week it falls
on. It makes use of the operators: toString, dateStringToDateTime, toDateTime and dayOfWeek:

![](images/sshot-38.png)