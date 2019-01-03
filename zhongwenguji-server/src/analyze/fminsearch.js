/* Modified from:
 * https://github.com/jonasalmeida/fminsearch
 */

/*
 * MIT License
 *
 * Copyright (c) Jonas Almeida.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *
 */

function fminsearch(fun, Parm0, x, y, Opt) {
  if(!Opt){Opt={}};
  if(!Opt.maxIter){Opt.maxIter=1000};
  if(!Opt.step){// initial step is 1/100 of initial value (remember not to use zero in Parm0)
    Opt.step=Parm0.map(function(p){return p/100});
    Opt.step=Opt.step.map(function(si){if(si==0){return 1}else{ return si}}); // convert null steps into 1's
  };
  if(typeof(Opt.display)=='undefined'){Opt.display=true};
  if(!Opt.objFun){Opt.objFun=function(y,yp){return y.map(function(yi,i){return Math.pow((yi-yp[i]),2)}).reduce(function(a,b){return a+b})}} //SSD
  
  var cloneVector=function(V){return V.map(function(v){return v})};
  var ya,y0,yb,fP0,fP1;
  var P0=cloneVector(Parm0),P1=cloneVector(Parm0);
  var n = P0.length;
  var step=Opt.step;
  var funParm=function(P){return Opt.objFun(y,fun(x,P))}//function (of Parameters) to minimize
  // silly multi-univariate screening
  for(var i=0;i<Opt.maxIter;i++){
    for(var j=0;j<n;j++){ // take a step for each parameter
      P1=cloneVector(P0);
      P1[j]+=step[j];
      if(funParm(P1)<funParm(P0)){ // if parm value going in the righ direction
        step[j]=1.2*step[j]; // then go a little faster
        P0=cloneVector(P1);
      }
      else{
        step[j]=-(0.5*step[j]); // otherwiese reverse and go slower
      } 
    }
    if(Opt.display){if(i>(Opt.maxIter-10)){/*console.log(i+1,funParm(P0),P0)*/}}
  }
  // if (!!document.getElementById('plot')){ // if there is then use it
  //   fminsearch.plot(x,y,fun(x,P0),P0);
  // }
  return P0
};

fminsearch.load=function(src){ // script loading
  // example: fminsearch.load('http://localhost:8888/jmat/jmat.js')
  var s = document.createElement('script');
  s.src = src;
  document.head.appendChild(s);
  s.parentElement.removeChild(s);
};

fminsearch.plot=function(x,y,yp,Parms){ // ploting results using <script type="text/javascript" src="https://www.google.com/jsapi"></script>
  // create Array in Google's format
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'X');
  data.addColumn('number', 'Observed');
  data.addColumn('number', 'Model fit');
  var n = x.length;
  for (var i=0;i<n;i++){
    data.addRow([x[i],y[i],yp[i]]);
  };
  //var results = new google.visualization.ScatterChart(
  var titulo='Model fitting';
  if(!!Parms){titulo='Model parameters: '+Parms};
  var chart = new google.visualization.ComboChart(
    document.getElementById('plot'));
      chart.draw(data, {title: titulo,
                        width: 600, height: 400,
                        vAxis: {title: "Y", titleTextStyle: {color: "green"}},
                        hAxis: {title: "X", titleTextStyle: {color: "green"}},
              seriesType: "scatter",
              series: {1: {type: "line"}}}
                );
};

module.exports = fminsearch;