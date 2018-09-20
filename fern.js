/* 
    Author: Vanessa Serao
    Computer Graphics MTSU
    9/20/2018
*/


var canvas, gl, program;
var fernPoints; 
var SIZE= 50000; // maximum points to draw the leaf
var points=[]; // array that will store the points

var value= false; // bool for keydown
var click= true; // bool for mouse click

 // harcoded fern with 4 sets and (a,b,c,d,e,f) values each
var fern1= [[  0.0,    0.0,      0.0,  0.16,  0.0,    0.0],
            [  0.2,  -0.26,     0.23,  0.22,  0.0,    1.6],
            [-0.15,   0.28,     0.26,  0.24,  0.0,   0.44],
            [ 0.75,   0.04,    -0.04,  0.85,  0.0,    1.6]];

var fern2= [[  0.0,    0.0,      0.0,  0.16,  0.0,   0.0],
            [  0.2,  -0.26,     0.23,  0.22,  0.0,   1.6],
            [-0.15,   0.28,     0.26,  0.24,  0.0,  0.44],
            [ 0.85,   0.04,    -0.04,  0.85,  0.0,   1.6]]; 

// probability for the 1st fern
var prob1=  [  0.1,   0.08,     0.08,   0.74];
// prbability forthe second fern
var prob2 = [ 0.01,   0.07,     0.07,   0.85];


function main()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
   
     //  Configure WebGL
     gl.viewport(0,0, canvas.width, canvas.height);
     gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
 
   // call the function that generates and scales the points 
   fernPoints=generatePoints(fern1, prob1);

   // when 'c' is pressed on the keyboard, change the color and when pressed again, 
   //change the color back(green to orange)
   window.onkeydown = function(event)
   {
       var key = String.fromCharCode(event.keyCode);
       if (key == 'C')
       {
           value= !value;
           render();
       }
   };

  // when the mouse is clicked anywhere on the window,
  // the shape of the fern will change 
  window.addEventListener("click", function main()
   { 
        click = !click; // change states
        if (click == 0)  
            fernPoints=generatePoints(fern2, prob2); // generates second fern
        else 
            fernPoints=generatePoints(fern1, prob1);

        //console.log(click);
       gl.bufferData( gl.ARRAY_BUFFER, flatten(fernPoints), gl.STATIC_DRAW );
       render();
    });
   
   
    
     //  Load shaders and initialize attribute buffers
     program = initShaders( gl, "vertex-shader", "fragment-shader" );
     gl.useProgram( program );

     // Load the data into the GPU
     var bufferId = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
     gl.bufferData( gl.ARRAY_BUFFER, flatten(fernPoints), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    
    render();
}


function generatePoints(chosenfern, prob)
{  
    // declare local variables
    var rand;
    points=[]; 
    var newX, newY; 
    var x=0,y=0; // current points
    var Xmax=0, Xmin=0, Ymax=0, Ymin =0;

   
    // generate the points
    for (var i=0; i<SIZE; i++)
    {
            rand= Math.random(); // generates a random value
            var rowIndex;

            // get points for the fern
            // check if the random value is less that or equal to the probability of each fern
            // for each value in the probability array and assign the row to rowIndex
           
            if (rand <= prob[0])
                rowIndex = 0; 
            else if (rand <= prob[0]+prob[1])
                rowIndex= 1;
            else if (rand <= prob[0]+prob[1]+prob[2])
                rowIndex = 2;
            else
                rowIndex= 3;
            
           var fernPoint= chosenfern[rowIndex]; // access the points in the fern */
           
           // each points of the fern a-f
           var a=fernPoint[0]; 
           var b=fernPoint[1]; 
           var c=fernPoint[2];
           var d=fernPoint[3];
           var e=fernPoint[4];
           var f=fernPoint[5];

           // formula used to draw the fern
            newX= a*x + b*y +e;
            newY= c*x + d*y + f;
            //console.log(newX, newY);
          
            // find maximum and minimum values of x and y
            if (x > Xmax)
                Xmax=x;
            if (x< Xmin)
                Xmin=x;

            if (y > Ymax)
                Ymax= y;
            if (y< Ymin)  
                Ymin= y;

            // assign the new value to x
            x= newX;
            y= newY;
            
            // push all the points into the points array
            //  50000 points to draw the shape
            points.push(vec2(x,y));  

        }// end of for

       
        // create a new array where all the scaled points will be created 
        var newPoints=[];

         //loop to scale the shape to canvas. Uses the previous array to do so
         // push the scaled points into the new array
         
        var scaleX, scaleY;
        for ( var j=0; j < SIZE; j++)
        {
            scaleX= (((points[j][0]-Xmin)/(Xmax-Xmin))*2-1)*.8;
            scaleY= ((points[j][1]-Ymin)/(Ymax-Ymin))*2-1;
            newPoints.push(vec2(scaleX, scaleY));
        }
        // return the scaled array with the 50000 points
        return newPoints;

}

function render()
{
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), value);
        gl.drawArrays(gl.POINTS, 0, fernPoints.length);
       
      
       
       
}