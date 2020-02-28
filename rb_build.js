"use strict";

/* Method added to any DOM element that removes all child nodes of element */
HTMLElement.prototype.removeChildren = function() {
   while (this.firstChild) {
      this.removeChild(this.firstChild);
   }   
};

/* Method added to the select element to return the value of the selected option */
HTMLSelectElement.prototype.selectedValue = function() {
   var sIndex = this.selectedIndex;
   return this.options[sIndex].value;
};

var pizzaPrice = {
    size12 : 11,
    size14 : 13,
    size16 : 16,
    stuffed : 3,
    pan : 2,
    doubleSauce : 1.50,
    doubleCheese : 1.50
};
//cart object
function cart() {
    this.totalCost = 0;
    this.items = [];
}
//food item object
function foodItem() {
    this.price = 0;
    this.qty = 0;
}
//calcs item cost
foodItem.prototype.calcItemCost = function() {
    return this.price * this.qty;
}
// calcs cart cost
cart.prototype.calcCartTotal = function() {
    var cartTotal = 0;
    for(var i = 0; i < this.items.length;i++) {
        cartTotal += this.items[i].calcItemCost();
    }
    console.log(cartTotal);
    /*
    this.items.ForEach(function(item) {
                       cartTotal += item.calcItemCost();
                }) */
    this.totalCost = cartTotal;
    return this.totalCost;
}


//adds the item to the cart
foodItem.prototype.addToCart = function(cart) {
    cart.items.push(this);
}
//remoes it from cart
foodItem.prototype.removeFromCart = function(cart) {
    for(var i = 0; i < cart.items.length;i++) {
        if(cart.items[i] == this) {
            cart.items.splice(i,1);
            break;
        }
    }
}

//pizza object
function pizza() {
    this.size;
    this.crust;
    this.doubleSauce; //y/n
    this.doubleCheese; //y/n
    this.toppings = [];
}
//topping object
function topping() {
    this.name;
    this.side;
}
//prototype inheritance 
pizza.prototype = new foodItem();
topping.prototype = new foodItem();

//adds the topping to the array in the pizza
pizza.prototype.addTopping = function(topping) {
    this.toppings.push(topping);
}

//calculated the pizza price
pizza.prototype.calcPizzaPrice = function() {
    if(this.size==="12") {
        this.price = pizzaPrice.size12;
    }
    else if(this.size==="14") {
        this.price = pizzaPrice.size14;
    }
    else if(this.size==="16") {
        this.price = pizzaPrice.size16;
    }
    if(this.crust==="stuffed") {
        this.price+= pizzaPrice.stuffed;
    }
    if(this.crust==="pan") {
        this.price+= pizzaPrice.pan;
    }
    if(this.doubleSauce) {
        this.price += pizzaPrice.doubleSauce;
    }
    if(this.doubleCheese) {
        this.price += pizzaPrice.doubleCheese;
    }
    for(var i = 0; i < this.toppings.length; i++) {
        this.price += this.toppings[i].qty * 1.50;
    }
    return this.price;
}


//event to load whe page "loads", extensive
window.addEventListener("load",function() {
    //grabs the elements of the pizza html page
    var pizzaPreviewBox = document.getElementById("previewBox");
    var pizzaSummary = document.getElementById("pizzaSummary");
    var pizzaSizeBox = document.getElementById("pizzaSize");
    var pizzaCrustBox = document.getElementById("pizzaCrust");
    var pizzaDoubleSauceBox = document.getElementById("doubleSauce");
    var pizzaDoubleCheeseBox = document.getElementById("doubleCheese");
    /*
    var toppingsOptions = document.getElementById("toppings");
    */
    var toppingsOptions = document.querySelectorAll("input.topping");
    var pizzaQuantityBox = document.getElementById("pizzaQuantity");
    var addToCartButton = document.getElementById("addToCart");
    var cartTableBody = document.getElementById("cartTable");
    var cartTotalBox = document.getElementById("cartTotal");
    
    //setting up when to draw the pizza
    pizzaSizeBox.onchange = drawPizza;
    pizzaCrustBox.onchange = drawPizza;
    pizzaDoubleSauceBox.onclick = drawPizza;
    pizzaDoubleCheeseBox.onclick = drawPizza;
    pizzaQuantityBox.onchange = drawPizza;
    //assigns it to each topping
    for(var i = 0; i <toppingsOptions.length;i++) {
        console.log("toppingsList");
        toppingsOptions[i].onclick = drawPizza;
    }
    var myCart = new cart();
    addToCartButton.onclick = addPizzaToCart;
    
    //builds the pizza
    function buildPizza(newPizza) {
        newPizza.qty = pizzaQuantityBox.selectedValue();
        newPizza.size = pizzaSizeBox.selectedValue();
        newPizza.crust = pizzaCrustBox.selectedValue();
        newPizza.doubleSauce = pizzaDoubleSauceBox.checked;
        newPizza.doubleCheese = pizzaDoubleCheeseBox.checked;
        //checks whick toppings are checked
        var checkedToppings = document.querySelectorAll("input.topping:checked");
        for(var i = 0;i < checkedToppings.length;i++) {
            if(checkedToppings[i].value !=="none") {
                var myTopping = new topping();
                myTopping.name = checkedToppings[i].name;
                myTopping.side = checkedToppings[i].value;
                
                if(checkedToppings[i].value ==="full") {
                    myTopping.qty = 1;
                } else {
                    myTopping.qty = 0.5;
                }
                newPizza.addTopping(myTopping);
            }
        }
    }
    //adds the pizza to the cart
    function addPizzaToCart() {
        var myPizza = new pizza();
        buildPizza(myPizza);
        myPizza.addToCart(myCart);
        //creating the elemtns for each of the cart 
        var newItemRow = document.createElement("tr");
        cartTableBody.appendChild(newItemRow);
        
        var summaryCell = document.createElement("td");
        summaryCell.textContent = pizzaSummary.textContent;
        newItemRow.appendChild(summaryCell);
        
        var qtyCell = document.createElement("td");
        //qtyCell.textContent = pizzaQuantityBox.textConent;
        qtyCell.textContent = myPizza.qty;
        newItemRow.appendChild(qtyCell);
        
        var priceCell = document.createElement("td");
        priceCell.textContent = myPizza.calcPizzaPrice().toLocaleString('en-US', {style: "currency", currency: "USD"});
        newItemRow.appendChild(priceCell);
        
        var removeCell = document.createElement("td");
        var removeButton = document.createElement("input");
        removeButton.value = "X";
        removeButton.type = "button";
        console.log(removeButton.textContent); newItemRow.appendChild(removeCell.appendChild(removeButton));
        //giving the price of the pizza
        cartTotalBox.value = myCart.calcCartTotal().toLocaleString('en-US', {style: "currency", currency: "USD"});
        console.log(myCart);
        removeButton.onclick = function () {
            myPizza.removeFromCart(myCart);
            cartTableBody.removeChild(newItemRow);
            cartTotalBox.value = myCart.calcCartTotal().toLocaleString('en-US', {style: "currency", currency: "USD"});
        };
        resetDrawPizza();
        
    }
    //function to draw the pizza
    function drawPizza() {
        console.log("drawPizza function entered")
        pizzaPreviewBox.removeChildren(); //help on this
        var pizzaDescription = "";
        pizzaDescription += pizzaSizeBox.selectedValue() +'" pizza, ';
        pizzaDescription += pizzaCrustBox.selectedValue() + ", ";
        //adds the sauce/cheese image if checked
        if(pizzaDoubleSauceBox.checked) {
            var sauceImg = document.createElement("img");
            sauceImg.src = "rb_doublesauce.png";
            pizzaPreviewBox.appendChild(sauceImg);
            pizzaDescription += "double sauce, ";
        }
        if(pizzaDoubleCheeseBox.checked) {
            var cheeseImg = document.createElement("img");
            cheeseImg.src = "rb_doublecheese.png";
            pizzaPreviewBox.appendChild(cheeseImg);
            pizzaDescription += "double cheese, ";
        }
        //checks the topping and clips it accordingly
        var checkedToppings = document.querySelectorAll("input.topping:checked");
        for(var i = 0;i < checkedToppings.length;i++) {
            console.log("hi1");
            if(checkedToppings[i].value !=="none") {
                console.log("hi2")
                pizzaDescription += checkedToppings[i].name + "(" + checkedToppings[i].value + "), ";
                var toppingImage = document.createElement("img");
                toppingImage.src = "rb_" + checkedToppings[i].name + ".png";
                pizzaPreviewBox.appendChild(toppingImage);
                
                if(checkedToppings[i].value === "left") {
                    console.log("hi3");
                    toppingImage.style.clip = "rect(0px, 150px, 300px, 0px)";
                } else if(checkedToppings[i].value === "right") {
                    toppingImage.style.clip = "rect(0px, 300px, 300px, 150px)";
                }
            }
        }
        pizzaSummary.textContent = pizzaDescription;
    }
    //resets the pizza to normal
    function resetDrawPizza() {
      // Object collection of all topping option buttons with a value of 'none'
      var noTopping = document.querySelectorAll("input.topping[value='none']");
      
      pizzaSizeBox.selectedIndex = 1;
      pizzaCrustBox.selectedIndex = "thin";
      pizzaDoubleSauceBox.checked = false;
      pizzaDoubleCheeseBox.checked = false;
      
      for (var i = 0; i < noTopping.length; i++) {
         noTopping[i].checked = true;
      }      
      pizzaSummary.textContent = "14\" pizza, thin";
      pizzaPreviewBox.removeChildren();
      pizzaQuantityBox.selectedIndex = 0;
      drawPizza;
   } 
});