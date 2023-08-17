

import { useState } from 'react';

function determinantOfMatrix(mat) {

    var ans = 0;
    ans = mat[0][0] * (mat[1][1] * mat[2][2] - mat[2][1] * mat[1][2])
      - mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0])
      + mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]);
    return ans;
}


export default function findSolution(coeff) {

    var [cordinates, setCordinates] = useState([0,0,0]);

    // Matrix d using coeff as given in cramer's rule
    var d = [
      [coeff[0][0], coeff[0][1], coeff[0][2]],
      [coeff[1][0], coeff[1][1], coeff[1][2]],
      [coeff[2][0], coeff[2][1], coeff[2][2]],
    ];

    // Matrix d1 using coeff as given in cramer's rule
    var d1 = [
      [coeff[0][3], coeff[0][1], coeff[0][2]],
      [coeff[1][3], coeff[1][1], coeff[1][2]],
      [coeff[2][3], coeff[2][1], coeff[2][2]],
    ];
  
    // Matrix d2 using coeff as given in cramer's rule
    var d2 = [
      [coeff[0][0], coeff[0][3], coeff[0][2]],
      [coeff[1][0], coeff[1][3], coeff[1][2]],
      [coeff[2][0], coeff[2][3], coeff[2][2]],
    ];
  
    // Matrix d3 using coeff as given in cramer's rule
    var d3 = [
      [coeff[0][0], coeff[0][1], coeff[0][3]],
      [coeff[1][0], coeff[1][1], coeff[1][3]],
      [coeff[2][0], coeff[2][1], coeff[2][3]],
    ];
  
    // Calculating Determinant of Matrices d, d1, d2, d3
    var D = determinantOfMatrix(d);
    var D1 = determinantOfMatrix(d1);
    var D2 = determinantOfMatrix(d2);
    var D3 = determinantOfMatrix(d3);
    // console.log('D: ', D);
    // console.log('D1: ', D1);
    // console.log('D2: ', D2);
    // console.log('D3: ', D3);

    // Case 1
    if (D !== 0) {
      // Coeff have a unique solution. Apply Cramer's Rule
      var x = D1 / D;
      var y = D2 / D;
      var z = D3 / D; // calculating z using cramer's rule

      console.log('x: ', x);
      console.log('y: ', y);
      console.log('z: ', z);
      setCordinates([x,y,z]);
  
      // System.out.printf("Value of x is : %.6f\n", x);
      // System.out.printf("Value of y is : %.6f\n", y);
      // System.out.printf("Value of z is : %.6f\n", z);
  
      // answer.setText(String.format("\nX: %.2f", x));
      // answer.append(String.format("\nY: %.2f", y));
      // answer.append("\nZ: 0");
    }
  
    // Case 2
    else {
      if (D1 === 0 && D2 === 0 && D3 === 0) {
        console.log('Infinite solutions');
      }
      else if (D1 !== 0 || D2 !== 0 || D3 !== 0) {
        console.log('No solutions');
      }
      // answer.setText("Location not found!");
    }

    return {
        cordinates
    };
}
