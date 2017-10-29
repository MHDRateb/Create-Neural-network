
//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-|
//                                                                                   ||
// Created by:-                         MHD Rateb Alissa 2017                        ||  
//                           F21BC Biologically Inspired Computation                 ||  
//                                  Artificial Neural Network                        ||
//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-|
// var synaptic = require('synaptic');


var population = [];

var network;

var populationSize;



//INPUT DATA
var Xor = [
    {
        input: [0, 0],
        output: 0
    },
    {
        input: [0, 1],
        output: 1
    },
    {
        input: [1, 0],
        output: 1
    },
    {
        input: [1, 1],
        output: 0
    }];
//__________________________________________________________________________________
//___________________________________Neural Network_______________________________________________

const NeuralNetwork = (initialNetwork) => {
    if (initialNetwork) {
        network = initialNeuralNetwork();
    }
    myNetwork = network.myNetwork;
    inputLayer = network.inputLayer;
    hiddenLayer = network.hiddenLayer;

    return createpopulation(myNetwork, inputLayer, hiddenLayer, population);
}

function initialNeuralNetwork() {

    var Neuron = synaptic.Neuron;
    var Layer = synaptic.Layer;
    var Network = synaptic.Network;
    var Trainer = synaptic.Trainer;

    inputLayer = new Layer(2);
    hiddenLayer = new Layer(5);
    outputLayer = new Layer(1);

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    var myNetwork = new Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });

    return { myNetwork: myNetwork, inputLayer: inputLayer, hiddenLayer: hiddenLayer }
}

function createpopulation(myNetwork, inputLayer, hiddenLayer, population) {


        //K HERE FOR POPULATIONS SIZE
        for (var k = 0; k < populationSize; k++) {
            //Create the zero generation (Intilize weigths first time randomly)
            var weightsSet = intilizeweigth(inputLayer, hiddenLayer);
            // these two lines return the neural and normal output for one individual
            //to pass these outputs to calculate the MSE(Mean sequre error)
            var outputs = [];
            for (var i = 0; i < 10; i++) {
                outputs.push(calculateOutputs(myNetwork));
            }
            //calculate mean sequre error and add it as attribute to the indvidual
            var meanerror = MSE(outputs);
            weightsSet.mean = meanerror;
            // add the indvidual to population
            population.push(weightsSet)
        }
 

    return population;
}



//intitla weights in first time
function intilizeweigth(inputLayer, hiddenLayer) {
    var weights = [];
    var objInput = inputLayer.connectedTo[0].connections;
    var objHidden = hiddenLayer.connectedTo[0].connections;

    Object.keys(objInput).forEach(function (key) {
        objInput[key].weight = getRandom();
        weights.push(objInput[key].weight);
    });

    Object.keys(objHidden).forEach(function (key) {
        objHidden[key].weight = getRandom();
        weights.push(objHidden[key].weight);
    });
    //return individual which will create the zero generation but without mean sequre error
    return { weights: weights }

}
//apply the child(which EA created it)
function applyWeigth(inputLayer, hiddenLayer, child) {
    var weights = [];
    var objInput = inputLayer.connectedTo[0].connections;
    var objHidden = hiddenLayer.connectedTo[0].connections;

    var i = 0;
    Object.keys(objInput).forEach(function (key) {
        objInput[key].weight = child[i];
        weights.push(objInput[key].weight);
        i += 1;
    });
    var h = 10;
    Object.keys(objHidden).forEach(function (key) {
        objHidden[key].weight = child[h];
        weights.push(objHidden[key].weight);
        h += 1;
    });
    return { weights: weights }

}
//return random number between -5 and 5
function getRandom() {
    var min = -5;
    var max = 5;
    var weight = Math.random() * (max - min) + min;
    return weight
}

//calculate outputs for each inputs with the weights from weightsSet
function calculateOutputs(myNetwork) {
  
    var randomIndex = Math.floor(Math.random() * Xor.length);
    var input = Xor[randomIndex].input;
    var actualoutput = Xor[randomIndex].output;
    inputLayer.activate(input);
    hiddenLayer.activate();

    var neuraloutput = outputLayer.activate();

    // console.log("actualinput= ", input, "actualoutput= ", actualoutput, "neuraloutput= ", neuraloutput[0])
    return {
        neuraloutput: neuraloutput[0],
        actualoutput: actualoutput
    };
}
//Mean sequre error function
function MSE(outputs) {
    var mean = 0;
    outputs.forEach(function (output) {
        var difittestrence = Math.abs(output.actualoutput - output.neuraloutput);
        var error = Math.pow(difittestrence, 2);
        mean += error;
    })
    return mean / outputs.length;

}




//fittest function to return the fittest indvidual from the population
function getFittest(population) {
    var means = [];
    for (var i = 0; i < population.length; i++) {
        means.push(population[i].mean)
    }
    var min = Math.min.apply(null, means);
    var indx = means.indexOf(min);
    var fittestt = population[indx];
    return fittestt;
}
var containWeigth = (child, obj) => {
    if (child.indexOf(obj) != -1) {
        return true
    }
    else {
        return false
    }
}

// main()
//__________________________________________________________________________________
//_______________________________Main___________________________________________________
function main() {
    var initialNetwork = true;
    NeuralNetwork(initialNetwork);
    for(var i=0;i<population.length;i++){
        console.log("the population:-","individual number ",i+1, population[i])
    }
    console.log("_______________");
    //this function to test the best indivivdual in zero generation
   test(population);


}

//test function
function test(population) {

    var myNetwork = network.myNetwork;
    var inputLayer = network.inputLayer;
    var hiddenLayer = network.hiddenLayer;

    var fittest = getFittest(population);

    applyWeigth(inputLayer, hiddenLayer, fittest);

    function getFittest(population) {
        var means = [];
        for (var i = 0; i < population.length; i++) {
            means.push(population[i].mean)
        }
        var min = Math.min.apply(null, means);
        var indx = means.indexOf(min);
        var fittestt = population[indx];
        return fittestt;
    }
    console.log("best set of weights ", fittest)
    console.log("_______________");

    results.innerText ="The fittest weights set in the last generation is "+"\n";   
    results.innerText +=JSON.stringify(fittest,null,2);
    result.appendChild(results);

    function applyWeigth(inputLayer, hiddenLayer, fittest) {

        var weights = [];
        var objInput = inputLayer.connectedTo[0].connections;
        var objHidden = hiddenLayer.connectedTo[0].connections;
        var i = 0
        Object.keys(inputLayer.connectedTo[0].connections).forEach(function (key) {
            inputLayer.connectedTo[0].connections[key].weight = fittest.weights[i];
            weights.push(inputLayer.connectedTo[0].connections[key].weight);
            i += 1;
        });
        var h = 10;
        Object.keys(hiddenLayer.connectedTo[0].connections).forEach(function (key) {
            hiddenLayer.connectedTo[0].connections[key].weight = fittest.weights[h];
            weights.push(hiddenLayer.connectedTo[0].connections[key].weight);
            h += 1;
        });

        return { weights: weights }

    }
    var Xor = [
        {
            input: [0, 0],
            output: 0
        },
        {
            input: [0, 1],
            output: 1
        },
        {
            input: [1, 0],
            output: 1
        },
        {
            input: [1, 1],
            output: 0
        }];
    for (var iii = 0; iii < Xor.length; iii++) {
        
        console.log("the input",iii+1,Xor[iii].input);
        results2.innerText +="  the input is "+Xor[iii].input+"\n";

        inputLayer.activate(Xor[iii].input);
        hiddenLayer.activate()
        var r = outputLayer.activate()

        console.log("the neural output",iii+1,r)
        results2.innerText +="  the neural output is "+r+ "\n";
        result2.appendChild(results2);
    }
   
    
}






