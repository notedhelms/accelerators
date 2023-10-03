---
id: classic_Cart
title: Grocery Cart
tags:
  - Corticon.js
  - Corticon classic
---

Implement rules to apply promotions to a shopping cart.

In this tutorial, you learn how to use some of Corticon Studio’s more complex and powerful functions, including:

-   Building a **Vocabulary** with associations—Associations enable you to define relationships between entities. For example, many items can be associated with one shopping cart.
-   Using **Scope** and **Aliases** in rules—Scope and Aliases enable you to define rules that apply to an entity in relation to another entity. For example, if the total price of items in a customer’s shopping cart exceeds $100, give the customer a coupon.
-   Creating **action-only** rules—Rules in column 0 of a Rulesheet. They are non-conditional rules: the rules always fire so the action always applies. For example, calculate the total price of items in a shopping cart.
-   Using **equations** in rules.
-   Using **Collections** and **Collection operators**—Collections enable you to define rules that apply to a group of entity instances. For example, check to see if any items in a Shopping Cart are from the Liquor department.
-   Using **Filters** in rules—Filters enable you to filter out data, so only entities that pass the filter criteria are evaluated by rules in a Rulesheet.
-   Using a variety of **attribute and entity operators** in rules.
-   Sequencing Rulesheets in a **Ruleflow**.
-   **Embedding attributes within rule statements**—This feature enables you to retrieve the value of an attribute instead of hard-coding it in a rule message. For example, `“${ShoppingCart.cashBackEarned} bonus earned today”`.
-   **Testing** at the Ruleflow level.

Just like the Basic Tutorial, you follow the rule development lifecycle: discover, model, and test rules. Because this tutorial focuses on teaching you how to build complex rule models, the Analyze phase is skipped to save time.

This tutorial is designed for hands-on use. Progress recommends that you follow along in Corticon Studio, using the provided instructions and illustrations. If you haven’t installed Corticon Studio yet, install it now. [Click here](https://www.progress.com/trial-corticon) for instructions on installing Corticon Studio.

## The business problem

The Advanced Tutorial uses a business case to build a rule model in Corticon Studio. The business case is as follows:

The owner of a chain of grocery stores wants to build and install a system of business rule-based smart cash registers in all its branches. Some branches are large supermarkets, and some are smaller convenience stores, which sell gasoline and other essentials.

In addition to the minimum cash register functionality (adding up the price of items in a customer’s shopping cart), the new system should also be able to apply:

-   Promotional rules
-   Loyalty program rules
-   Coupon generation rules
-   Special warning rules that alert the cashier to take certain actions

Because every item in every store has a bar-coded label, the system’s scanner can determine complete information about each item, such as which department an item comes from.

To foster customer loyalty and drive additional sales, a Preferred Shopper program launches in conjunction with the installation of the new business rule-based cash registers. Shoppers who enroll in the program are issued Preferred Shopper membership cards (one card per household) to present to the cashier at check-out time.

Benefits of the Preferred Shopper program include:

-   2% cash back on all purchases at any branch:
    -   The Preferred Shopper account tracks the accumulated cash back and allows the shopper to apply it to the total amount at any visit.
    -   The cashier asks a Preferred Shopper if they would like to apply their cash back balance to their current purchase.
    -   After which, the cumulative cash back total maintained by the system is reset to zero.
    -   The accumulation of cash back begins anew with the customer’s next purchase.
-   Eligibility for special promotions and coupons:
    -   A coupon for one free balloon for every item purchased from the Floral department. This coupon has no expiration date.
    -   A coupon for $2 off on their next purchase when 3 or more soda or juice items are purchased in a single visit. This coupon has an expiration date of one year from the date of issue.
    -   A coupon for 10% off their next gasoline purchase at any chain-owned convenience store with any purchase of $75 or more. This coupon has an expiration date of three months from the date of issue.

Additionally, in compliance with local, state, and federal laws, the chain needs to ensure that all purchases of liquor (any items from the Liquor department) are made by shoppers 21 or older. The new system should display an alert or warning on the cashier’s screen, prompting them to check the customer’s ID.

Discovering business rules involves two things:

-   Identifying the terms to be included in the Vocabulary
-   Identifying the business rules

Let’s start with the Vocabulary.

## Identify Vocabulary terms and associations

To get started, you review the business problem and start compiling terms that need to be included in the Vocabulary. You can then identify the key entities and the assumptions about each entity:

-   **Customer**:
    -   A Customer has a **Name**.
    -   A Customer uses a **Shopping Cart** to carry **Items**.
    -   A Customer may be a **Preferred Shopper** and have a **Preferred Shopper** account that is identified by swiping their Preferred Card at checkout.
    -   A Preferred Shopper account has a **Card Number**.
    -   A Preferred Shopper account holds a **Cash-Back Balance**.
    -   One Preferred Shopper account may be used by anyone in a family.
-   **Item**:
    -   Each Item has a **Name**.
    -   An Item has a **Price**.
    -   An Item has a **Bar-coded** label.
    -   An Item has a **Department** embedded in the Bar-coded label.
-   **Shopping Cart**:
    -   Shopping Carts contain the **Items** that a Customer purchases during each visit.
    -   Each Shopping Cart has a **Total Amount**.
    -   If the Customer has a Preferred Shopper account, a **Cash-Back Bonus** is calculated using the Shopping Cart’s total amount and is deducted from the total amount upon customer request.
-   **Coupon**:
    -   Coupons are issued to shoppers based on promotions.
    -   A Coupon has a **Description**.
    -   A Coupon has an **Issue Date**.
    -   A Coupon has an **Expiration Date**.

Based on these assumptions, you can derive the attributes for each entity in the Vocabulary. Attributes are properties or characteristics that distinguish one instance of an entity from another. For example, each item has attributes like name, price, and bar code. Such attribute values make each item unique.

This table lists the attributes for each entity along with their data type and attribute mode:

![Alt text](<images/grocery_vocab table.png>)

The mode of an attribute can be Base or Transient. **Base** attribute values are either sent to the rule model from a client application, returned to a client application from the rule model, or both. **Transient** attributes are only used within the rule model, and their values are assigned or derived by rules, but not sent to a client application. For example, the **cashBackEarned** attribute is a Transient attribute that is used to update the value of the **cumulativeCashBack** attribute, which is a Base attribute.

Next, let’s identify the associations for the Vocabulary. An association defines the relationship between two entities. It can be one-to-one, one-to-many, many-to-one, or many-to-many. In this grocery store business problem, you have the following associations:

-   Many Customers (members of a family) can be associated with one PreferredAccount (many-to-one).
-   One Customer can be associated with many ShoppingCarts over multiple visits (one-to-many).
-   One ShoppingCart can be associated with many Items (one-to-many).

To make these relationships clear, you create a diagram of the associations. Creating a diagram is especially useful when you have a large or complex Vocabulary with many associations. Here is the diagram of entities and associations for this business problem:

![Alt text](images/grocery_diagram.png)

In this diagram, the connectors between entities show the kind of relationship. For example, Customer has a one-to-many association with ShoppingCart.

## Identify the business rules

Next, let’s identify specific business rules. At a high level, this is the basic process followed by every customer making purchases at a store:

![](images/grocery_process.png)

Though this process may involve several steps, you as rule modelers should be most concerned with those steps where decisions are made. In this case, the **Checkout** step contains the rule-based decisions that are built into the store’s cash registers.

Let’s drill down into the **Checkout** step and define more detail about the rules inside. If you identify a natural sequence or flow of logical substeps within a single decision step, then you should:

1.  Organize the substeps using separate Rulesheets.
2.  Combine the Rulesheets into a Ruleflow

For the **Checkout** step, the following three substeps are identified. You create a Rulesheet for each of these substeps and combine them into a Ruleflow.

![](images/grocery_process2.png)

Next, let’s look at the business rules that you need to model for each substep:

![Alt text](<images/grocery_vocab table.png>)

Now, let’s implement the Vocabulary in Corticon Studio. To begin, launch Corticon Studio and create a Rule Project:

1.  On the **Start** menu, select **Progress > Corticon Studio**.
2.  In the **Workspace Launcher** dialog box, retain the default workspace and click **OK**. Corticon Studio opens.
3.  Select **File > New > Rule Project**.

![](images/2023-10-03-10-33-47.png)

4. In the **New Corticon Project** window, in the **Project name** field, type MyAdvancedTutorial, and click **Finish**.

![](images/2023-10-03-10-34-07.png)

## Create the Vocabulary

To create a Vocabulary file:

1. Right-click MyAdvancedTutorial and select New > Rule Vocabulary.

![](images/2023-10-03-10-36-05.png)

2. In the Create a New Vocabulary window, in the File name field, type groceryStore, and click Finish

![](images/2023-10-03-10-36-21.png)

The Vocabulary opens under the rule project MyAdvancedTutorial.

![](images/2023-10-03-10-36-33.png)

## Add Entities

Now, let’s add the entities (Customer, PreferredAccount, Item, ShoppingCart, Coupon):

1.  In the **Vocabulary editor** , right-click **groceryStore** and select **Add Entity**.

![](images/2023-10-03-10-37-04.png)

2. Rename this entity by typing Customer over the default name.
 
![](images/2023-10-03-10-37-21.png)

3. Repeat these steps to add the remaining entities. The result looks like this:

![](images/2023-10-03-10-37-41.png)

## Add Attributes

To add the attributes, start by adding attributes for the **Customer** entity based on this table:

![](images/2023-10-03-10-38-01.png)

[Download Rule Assets](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/corticon/templates/blob/main/classic-templates/Grocery-Cart/Shopping%20Cart.zip)

1. Right-click **Customer** and select **Add Attribute**, and then choose **String**.

![](images/2023-10-03-10-41-13.png)

> Note: The Data Type Time is not available in Corticon.js.

2. Rename this attribute by typing `name` over the default name.
   
![](images/2023-10-03-10-42-11.png)

3. Right-click **Customer**, select **Add Attribute**, and then choose **Boolean**

![](images/2023-10-03-10-43-03.png)

4. Type `isPreferredMember` over the default attribute name and enter.

![](images/2023-10-03-10-43-52.png)

5. In the **Mode** drop-down list, select **Transient**.

![](images/2023-10-03-10-43-58.png)

6. Add attributes for the rest of the entities based on this table: 
![](images/2023-10-03-10-44-19.png)

After adding all the attributes, the Vocabulary looks like this:

![](images/2023-10-03-11-18-07.png)

## Add Associations

To create associations between the entities, start with the association between Customer and PreferredAccount. This is a many-to-one association.

1.  Right-click **Customer** and select **Add Association**.

![](images/2023-10-03-11-18-23.png)

2. In the **Association** dialog box:
   * In the **Source Entity** group, select Customer with the Source **Many** and **Mandatory**.
   * In the **Target Entity Name** group, select **PreferredAccount** with the Target **One**.
   * Click **OK**.

![](images/2023-10-03-11-19-19.png)

 The association appears as shown here. 

3. Notice that the association appears as many-to-one (![](https://progress-be-prod.zoominsoftware.io/bundle/adv-corticon-tutorial/page/many-to-one.png?_LANG=enus)) under Customer and one-to-many (![](https://progress-be-prod.zoominsoftware.io/bundle/adv-corticon-tutorial/page/izm1559244605551.png?_LANG=enus)) under PreferredAccount.

![](images/2023-10-03-11-19-43.png)

4.  Similarly, add associations between:
-   Customer and ShoppingCart (one-to-many)
-   Item and ShoppingCart (many-to-one)The final output will look like this.

![](images/2023-10-03-11-21-03.png)

Each association has an association role name. For example, the association between Customer and PreferredAccount has the name **preferredAccount**. Note that the opposite association between PreferredAccount and Customer has the role name **customer**. A role name helps describe or clarify the relationship of an entity with another entity.

You can change the role name for an association to make it more meaningful. In our example, let’s change the role name for the association between Customer and PreferredAccount to **preferredCard** by double-clicking the association under Customer,and typing **preferredCard** over the default value.

![](images/2023-10-03-11-21-25.png)