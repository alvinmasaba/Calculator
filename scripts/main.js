// MAIN

let expression = new Array();                     // Stores the expression input values in order of entry including operators
let i = 0;
let answer;                                       // Stores value of the evaluated expression
let firstValueDecimal = false;                    // Decimal printing control 
let secondValueDecimal = false;
isNeg = false;
const input = document.querySelector(".input");
const output = document.querySelector(".output");

let numbers = document.querySelectorAll(".num-button");
numbers.forEach((number) => {
  number.addEventListener('click', () => {
    printNum(number.textContent)
  });
});

let operations = document.querySelectorAll(".op-button");
operations.forEach((operation) => {
  operation.addEventListener('click', () => {
    switch (operation.id) {
      case "del-button":
        if (expression[i][expression[i].length -1] == '.' && i == 0) {          // Re-allow decimals on a value if its decimal is deleted
          firstValueDecimal = false;
        } else if (expression[i][expression[i].length -1] == '.' && i == 2) {
          secondValueDecimal = false;
        } 
        if (expression[i] == undefined){
          break;
        } else if (expression[i].length > 1 && i > 0) {     
          expression[i] = expression[i].slice(0,-1);
        } else if (expression[i].length == 1 && i > 0) {
          expression.pop();
          i--;
        } else if (expression[i].length > 1 && i == 0) {
          expression[i] = expression[i].slice(0,-1);
        } else if (expression[i].length == 1 && i == 0) {
          expression = new Array();                         // If we delete the last digit in the expression make a clean array                      
          firstValueDecimal = false;
        }
        input.textContent = expression.join(' ');           // Input will always be the values in array joined by a space
        break;
      
      case "clear-button":                                  // Resets all values 
        input.textContent = '';
        output.textContent = '';
        answer = '';
        expression = new Array();
        i = 0;
        firstValueDecimal = false;
        secondValueDecimal = false;
        break;
        
      case "eval-button":
        if (expression.length == 3) {
          answer = operate(expression[0], expression[1], expression[2]).toFixed(2);;
          answer = (Math.floor(answer) == answer) ? Math.floor(answer) : answer;
        } else if (expression.length == 1 || expression.length == 2) {
          answer = Number(expression[0]).toFixed(2);
          answer = (Math.floor(answer) == answer) ? Math.floor(answer) : answer;
        }
        output.textContent = (answer != undefined) ? answer : '';         // If the answer is a valid output, print it, otherwise, print nothing
        expression = ((answer != undefined) && (answer != 'Can\'t divide by 0 bud!')) ? [answer.toString()] : new Array();  // Add it as the first value in array, or, if invalid, clean the array
        input.textContent = '';
        firstValueDecimal = ((answer == undefined) || (answer == 'Can\'t divide by 0 bud!')) ? false : answer.toString().includes('.'); 
        secondValueDecimal = false; 
        if (output.textContent == 'Can\'t divide by 0 bud!') {    // Fade message
          setTimeout(function(){
            output.textContent = '';
          }, 1000);
        };
        i = 0;
        break;
          
      default:    
        if (i == 0 && expression[i] == undefined) {                             
          output.textContent = 'Please enter a number before an operator';    // Only allow operators after a number 
          setTimeout(function(){
            output.textContent = '';
          }, 1000); 
          break;
        }

        if (!(expression[i] == undefined) && !(expression[i] == '+') && !(expression[i] == '-') && !(expression[i] == '*') && !(expression[i] == '/') && expression.length < 3) {  
          expression.push(operation.textContent);
          input.textContent = expression.join(' ');
          i++;
          isNeg = false;
          break;
        } else if (expression.length == 3 && expression[1] == '/' && expression[2] == '0') {
            expression = new Array();
            input.textContent = '';
            firstValueDecimal = false;
            secondValueDecimal = false;
            i = 0;
            output.textContent = 'Can\'t divide by 0 bud!';
            setTimeout(function(){
              output.textContent = '';
            }, 1000);
          } else if (expression.length == 3) {
              expression = [operate(expression[0], expression[1], expression[2]).toFixed(4)];
              expression.push(operation.textContent);
              input.textContent = expression.join(' ');
              secondValueDecimal = false;

        } else {
            break;
        }
        isNeg = false;
        break;
        };
    });
  });

let specialButton = document.querySelectorAll(".special-button");
specialButton.forEach((button) => {
  button.addEventListener('click', () => {
    switch (button.id) {
      case "decimal":
        if (i == 0 && !(firstValueDecimal)) {       // Print decimals in same manner as numbers, but we want to add a zero before the decimal if it is the first character of a value
          if (input.textContent == '' || input.textContent == '-') {
            printNum('0.');
          } else {
            printNum(button.textContent);
          }
          firstValueDecimal = true;                 // Disable decimal button on a value after it has received one
        } else if (i == 1) {
            i++;
            printNum('0.');
            secondValueDecimal = true;
        } else if (i == 2 && !(secondValueDecimal) && expression[i] != undefined && expression[i] != '-') {
            printNum(button.textContent);
            secondValueDecimal = true;
        } else if (i == 2 && !(secondValueDecimal) && (expression[i] == undefined || expression[i] == '-')) {
          printNum('0.');
          secondValueDecimal = true;
        }
        break;
      
      case "answer-button":
        if ((answer != undefined) && (answer != 'Can\'t divide by 0 bud!') && (answer != '')) {
          if (expression.length == 1) {
            expression = [answer.toString()];
            input.textContent = 'Ans';
          } else if (expression.length == 2) {
            expression.push(answer.toString())
            i++;
            input.textContent += ' Ans';
          }
        };
        break;
      
      case "negative":
        if (input.textContent == '') {
          expression = ['-'];
          input.textContent += '-';
          isNeg = true;
        } else if (expression.length == 2 && (i == 1 || i == 2)) {
          if (i == 1) {
            i++;
            expression[i] = '-';
            input.textContent = expression.join(' ');
            isNeg = true;
          } else if (i == 2 && expression[i] == undefined || expression[i] == ''){
            expression[i] = '-';
            input.textContent = expression.join(' ');
            isNeg = true;
          }
        }
        break;
    };
  });
});


// HELPER FUNCTIONS

const addNums = (...args) => {          // addition function
  let sum = Number(args[0]);
  for (let i = 1; i < args.length; i++) {
    sum += Number(args[i]);
  };
  return sum;
};

  
const subtractNums = (...args) => {      // subtraction function 
  let diff = Number(args[0]);
  for (let i = 1; i < args.length; i++) {
    diff -= Number(args[i]);  ``
  };
  return diff;
};
  
  
const  multiplyNums = (...args) => {    // multiplication function
  let product = Number(args[0]);
  for (let i = 1; i < args.length; i++) {
    product *= Number(args[i]); 
  };
  return product;
};
  
  
const  divideNums = (...args) => {      // division funtion 
  let quotient = Number(args[0]);
  for (let i = 1; i < args.length; i++) {
    if (args[i] != 0){
      quotient /= Number(args[i]); 
    } else {
      quotient = 'Can\'t divide by 0 bud!';
    }
  };
  return quotient;
};
  
  
const operate = ((a, op, b) => {        // operator function
  switch(op) {
    case '+':
      return addNums(a, b);
    case '-':
      return subtractNums(a, b);
    case '*':
      return multiplyNums(a, b);
    case '/':
      return divideNums(a, b);
  };
});

const printNum = ((element) => {
  if (expression[i] == '+' || (expression[i] == '-' && !(isNeg)) || expression[i] == '*' || expression[i] == '/') {   // To prevent the previous operator from attaching to the post operator number in table ie '+9';
    i++;
    expression[i] = element;
    input.textContent = expression.join(' ');
  } else if (expression[i] == undefined) {
    expression[i] = element;
    input.textContent = expression.join(' ');
  } else if (answer != '' && input.textContent == '') {
    answer = '';
    expression[i] = element;
    input.textContent = expression.join(' ');
    output.textContent = '';
  }
  else {
    expression[i] += element;
    input.textContent = expression.join(' ');
  }
})

