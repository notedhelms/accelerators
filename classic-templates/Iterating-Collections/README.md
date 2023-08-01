# Calculate A Sum of Collection Attributes 

[Download Rule Assets
](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/corticon/templates/blob/main/classic-templates/Iterating-Collections/Rule%20Assets.zip)

This sample demonstrates how to solve the problem of grouping like entities then performing calculations on their attributes' values. The objective is to identify instances of `Shipment` with identical values for the attribute `Shipment.postcode`. 

Let's assume you must send Shipments in cargo containers to destinations, but first must group together Shipments going to the same post code. However, you must also consider the maximum capacity of the cargo containers. Each shipment has a quantity defined in the attribute `Shipment.quantity`, and you must solve for the sum total of quantity of each of the Shipments going to the same post code.

Since there could be an arbitrary number of unique postal codes, there will need to be a correspondingly arbitrary number of quantity totals. This means you will need a new `totals` instance for each unique postal code. For grouping and finding unique values, you can iterate over a collection, using the newUnique operator to create an entity instance in a temporary 'holder' collection.

## Approach 1 (simple)
 
- Create a Group for each unique postal code.
- Add the quantity to the appropriate total.
 
 ![Sum Quantities by Postcode](images/sshot-1.png 'Rulesheet - Sum Quantities by Postcode.ers')
 
**Benefits**: 
- Accomplished in a single rulesheet.
 
## Approach 2 (a bit complex)
(Ruleflow FLOW.erf that comprises the following rulesheets)
Allocate the items to groups, and then use -sum to get the total. 
- Create Total Records.ers Create an instance of Group for each unique postal code. 
  ![Create Total Records.ers](images/sshot-2.png 'Create Total Records.ers')
- Associate Objects with Postcode Group.ers Move items into appropriate Group and use -sum to get the total.
 ![Associate Objects with Postcode Group.ers](images/sshot-3.png 'Associate Objects with Postcode Group.ers')

**Benefits**:
- Allows grouping of items by postal code.
- Additional statistics on maxminaverage of quantity by postal code can be evaluated easily.