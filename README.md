# Welcome to CleanTech API!

CleanTech API is a powerful RESTful API made on Nodejs + Express, it help you to keep track of your inventory along every date on the calendar, just make sure you have the right amount of inventory in warehouse before selling any of your goods.


## How does it works

You will be able two perform two actions:

- Create a new purchase Order => /api/v1/purchase
- Create a new sale Order => /api/v1/sale

### Create new purchase Order
- URL: /api/v1/purchase
-  Headers:
 ```
{ 
	 "Content-Type": "application/json"
}
 ```
 - Body:
```
{
	"dueDate": "2021-07-14T17:36:27.041Z"
	"quantity": 2,
	"product": {
		"title": "Scrubbing sponges"
	}
}
```

**dueDate** is an optional parameter, in case that is not provided the order will execute at once, also the **dueDate** should represent a value in the future in which the order will add new units to the inventory, the inventory in any point of time should be equal or less than 30 units.

**product.title** is an unique key for any product reference on the inventory, if no match is find on the DB then it will create a new product entry with the order amount as inventory

### Create new sale Order
- URL: /api/v1/sale
-  Headers:
 ```
{ 
	 "Content-Type": "application/json"
}
 ```
 - Body:
```
{
	"dueDate": "2021-07-14T17:36:27.041Z"
	"quantity": 2,
	"product": {
		"title": "Scrubbing sponges"
	}
}
```

**dueDate** is an optional parameter, in case that is not provided the order will execute at once, also the **dueDate** should represent a value in the future in which the order will remove units to the inventory, the inventory should always have more or the same amount as the sale order, otherwise it will not be created.

**product.title** is an unique key for any product reference on the inventory, if no match is find on the DB then the request would be rejected asking to provide a key for an existing product

