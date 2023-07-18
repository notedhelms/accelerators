# Dynamic Forms with Corticon.js

## What it is

Dynamic Forms are just one use case for Corticon.js.  In a nutshell, with Corticon and Corticon.js, you use a model-driven development environment called Corticon Studio for defining rules that will change input data based upon conditions and their resulting actions. Typically, a rules engine is used for making a decision from data that is _already known and available_, for example, calculating a loan rate based upon the data known about an applicant. Here, we're going to be _gathering data_ from the end user, dynamically presenting additional user prompts that may be impacted based upon previous answers.

## Design Pattern

Think of this design pattern as if you're designing a robot. Rule modelers will use Corticon to build the brain of the robot, while front end developers will handle its body. 

Corticon will be used to specify what prompts to present to the user, the input type for responding to the prompt, in what order to present the prompts, constraints/validations on the entered data, how the previous responses may or may not impact subsequent prompts, and when the requisite data has been gathered and is ready to be passed along to downstream systems. This is all defined in Corticon.js Studio, but are then transformed into a Decision Service-- the robot brain. 

The front end/client-side component in turn will be responsible for the styles of the forms' user interface and prompts, communicating with the decision service when the user hits 'next', rendering the components of the form that the decision service specifies, along with any constraints and validations it specifies.

For example, consider a car insurance application. Insurers in the United States are regulated at the state level, and states allow different kinds of factors to be weighed as part of the evaluation. A dynamic form for the insurance application can thus be used to only present prompts based upon the insured's state of residence. Depending upon the number of drivers, the number of vehicles, and the types of vehicles, different prompts would need to be presented, and different data elements captured. 

This logic can be managed in business rules by leveraging the fact that the deployable in Corticon.js is a self contained JavaScript bundle, so all rule logic can be built directly into a front end website or app to guide the rendering of the form. 

## Brand New Users

*   Sign up using the 'Try Now' link at [this page](https://www.progress.com/corticon-js)
*   Download and install using default installation settings

## Users with an Active Corticon.js License

*   Access Corticon.js Studio installer by clicking Corticon at [this page](https://www.progress.com/support/download-center)

Questions? Consult the [installation documentation](https://docs.progress.com/bundle/corticon-js-introduction/page/Install-Corticon.js-Studio.html) from the official Corticon documentation site.

# Setting up your environment

When we build the dynamic form rules, we're ultimately going to be transpiling the rules into a self-contained JavaScript bundle. In simpler terms, all of the logic will be encapsulated into just one file decisionServiceBundle.js. 

Front end developers handle the 'rendering side' of the form. This includes defining data that will be passed in at the onset of the form, styling, and where the data goes once the form is filled out. 

To make everyone's life easier, we provide open source implementations of Corticon.js Dynamic Forms which you can freely download, import into your environment, and adapt to your needs. This includes both sample rule assets that you can work with in Corticon.js Studio, and a sample client side rendering component. 

## Unique Considerations when Building Rules for Dynamic Forms Rules

In a typical decision automation use case, rulesheets and ruleflows are 'connected' from one to another when constructing the top level ruleflow. Connections are the objects that connect or “stitch” assets and objects together to control their sequence of execution.

If a connector is drawn from Rulesheet `sample1.ers` to `sample2.ers`, then when a deployed Ruleflow is invoked, it will execute the rules in `sample1.ers` first, followed by the rules in `sample2.ers`.

For dynamic forms however, instead of a decision that will always go through the same chronology during a single execution, dynamic forms require the ability to navigate throughout the objects in a ruleflow, such that different rules may fire at different times, depending upon dynamic variables. For example, the sequence may be determined based upon:

-   Data that the end user has entered to that point (e.g. to route to different parts of a ruleflow depending upon what type of claim a user has chosen to file)
-    Whether any data is pre-populated at the start of a ruleflow (e.g. leveraging account information specific to the end user as part of the decision for what gets presented in the form)

<table><tr>
<td>
  <p align="center" style="padding: 10px">
    <img alt="Forwarding" src="https://user-images.githubusercontent.com/40301564/186739602-888ae2bc-9d55-4bc6-a3cf-527e3d7e47a7.PNG" width="554">
    <br>
    <em style="color: grey">Dynamic Form Ruleflow </em>
  </p>
</td>
<td>
  <p align="center">
    <img alt="Routing" src="https://user-images.githubusercontent.com/40301564/186739592-17ba7774-31ed-413f-81f4-991308728116.PNG" width="515">
    <br>
    <em style="color: grey">Typical, Connected Ruleflow</em>
  </p>
</td>
</tr></table>

# Pre-Built UI Renderers


<!-- panels:start -->

<!-- div:title-panel -->

## UI

<!-- div:left-panel -->

Description: The entity UI is the ‘parent’ entity, returned at index 0, which will guide things like where we are in the form, when the form is complete, and where to store the accrued data. See table below for full scope of available out of the box options. Items with an asterisk are required.

<!-- div:title-panel -->

### pathToData

<!-- div:left-panel -->

Data Type: _Any alphanumeric string will be accepted, but in order to use user-selected responses to dynamically change form behavior in future steps, this should be set to an entity in the vocabulary that will accrue the data_
  
Description: We define which data we want to store by specifying in the initial stage of the rules which vocabulary entity should ‘store’ the data accrued throughout the form. This is specified with `UI.pathToData` in an initial stage, in this case, it will be the `AutoQuote` entity. The `pathToData` entity will be at index 1 in the JSON. The stored data can then be passed along to other workflow steps once the form is complete, or used to define a conditional rule at a later stage in the form.

<!-- div:right-panel -->

![Code](https://corticon.github.io/templates/#/form-templates/overview/images/pathToData.PNG)


<!-- div:title-panel -->

### noUiToRenderContinue

<!-- div:left-panel -->

Data Type: _T/F_


Description: Set to ‘T’ for any stages where no UI needs to be rendered, but some action (a decision/calculation/augmentation of separate rulesheet) needs to be executed. Does not need to be set to ‘F’ when this is not the case.

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/noUItoRender.png)
```hover mouse to copy
UI.noUItoRender
```
<!-- div:title-panel -->

### done

<!-- div:left-panel -->

Data Type: _T/F_

Description: Upon receiving a done instruction from the decision service (a notification of the end of the flow) via `UI.done=T`, it is expected the collected data will be passed to another function or process; typically an event will be raised with a pointer to the JSON data collected during the flow.

<!-- div:right-panel -->

<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/UIdone.png)

### **Copy these rules**

```
UI.done
```
<!-- div:title-panel -->

### nextStageNumber

<!-- div:left-panel -->

Data Type: _Integer_

Where to specify: **Action** row of rulesheet

Description: The decision service sets the attribute `UI.nextStageNumber` to specify the next step in the flow, unless it is the last stage, in which case this field is left null and done is set to ‘true’

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/nextStageNumber.png)

<!-- div:title-panel -->

### currentStageNumber

<!-- div:left-panel -->

Data Type: _Integer_

Where to specify: **Filter** panel of rulesheet, in advanced view

Description: When the client side rendering component is ready for the next step in the flow, it invokes the decision service by setting UI.currentStageNumber to `UI.nextStageNumber` in the input payload of the decision service.

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/currentStageNumber.png)

<!-- div:title-panel -->

###  Language

<!-- div:left-panel -->
- Data Type: _String_
- Description: On start, the rendered can accept the language from the UI but a decision service may switch the language based on some rules

---

<!-- div:title-panel -->

## Container 
`UI.containers`
<!-- div:left-panel -->

- Description: For all steps in which something is being presented to the user (versus just a calculation/decision made in the background), the decision service will specify the list of UI controls to render from the decision service JSON payload at the UI.containers element. This is an array of all the containers to render for this stage. The container can be viewed as a panel containing various labels and input fields. The container has various attributes, for example a title.

<!-- div:title-panel -->

### validationMsg

<!-- div:left-panel -->

- Data Type: _Alphanumeric string_
- Description: Creates a container wide validation message

<!-- div:title-panel -->

### description
<!-- div:left-panel -->

- Data Type: _Alphanumeric string_
- Description: An optional string that doesn’t impact behavior of the form. It is mostly useful for troubleshooting.

<!-- div:title-panel -->

### id

<!-- div:left-panel -->

- Data Type: _Any unique alphanumeric string_
- Description: Required if any container is being rendered.

<!-- div:title-panel -->

### title

<!-- div:left-panel -->

- Data Type: _Alphanumeric string_
- Description: Renders the h3 header on Container entity

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/createContainer.png)

---

<!-- div:title-panel -->

## UIControl 
`UI.containers.uiControls`
<!-- div:left-panel -->

- Description: Each UI control element has multiple attributes. The most important one is the type attribute as it allows the client-side component to know what kind of control to render and which necessary attributes to access based on the type. See table below for full scope of available out of the box options. Items with an asterisk are required.

<!-- div:title-panel -->

### type

<!-- div:left-panel -->

- Description: The specific type of UI Control. In the out of the box test driver, the following UI Controls / specifications are defined:

#### Text 

- Syntax: `type = ‘Text’`
- Description: Single line text field input

<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/text_rule.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/text_rendered.png)
<!-- tabs:end -->

<!-- div:left-panel -->

#### TextArea 

- Syntax: `type = ‘TextArea’`
- Description: Multi-lines text input

<!-- div:right-panel -->
<!-- tabs:start -->
### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/text_area_rules.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/text_area_rendered.png)
<!-- tabs:end -->


<!-- div:left-panel -->

####  SingleChoice

- Syntax: `type = ‘SingleChoice’`
- Description: Renders as a checkbox with value stored as T/F

<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/singlechoice.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/singlechoice-rendered.png)
<!-- tabs:end -->

<!-- div:left-panel -->

#### MultipleChoices

- Syntax:  `type = ‘MultipleChoices’`
- Description: Multiple choice dropdown. Options must be specified either by pointing to a JSON datasource or defining the options in a subsequent rulesheet.

<!-- div:right-panel -->
<!-- tabs:start -->
### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/multiple_choices_rules.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/multiple_choices_rendered.png)
<!-- tabs:end -->

<!-- div:left-panel -->

#### Number

- `type = ‘Number’`
- Description: Single number input
    
<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/number_rules.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/number_rendered.png)
<!-- tabs:end -->

<!-- div:left-panel -->

#### DateTime

- `type = ‘DateTime’`
- Description: Date picker
    
<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/date_time_rules.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/date_time_rendered.png)
<!-- tabs:end -->

<!-- div:left-panel -->

#### ReadOnlyText

- `type = ‘ReadOnlyText’`
- Description: A control to render HTML text

<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/readOnlyText.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/readOnlyText_render.png)
<!-- tabs:end -->

<!-- div:left-panel -->

#### YesNo

- `type = ‘YesNo’`
- Description: Dropdown of Yes or No, stored as Yes or No
    
    
<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/yes_no_rule.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/yes-no_rendered.png)
<!-- tabs:end -->

<!-- div:left-panel -->

#### YesNoBoolean

- `type = ‘YesNoBoolean’`
- Description: Dropdown of Yes or No, stored as T or F
    
<!-- div:right-panel -->

<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/yes_no_boolean_rule.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/yes-no_rendered.png)

<!-- tabs:end -->

<!-- div:left-panel -->

#### FileUpload

- `type = ‘FileUpload’`
- Description: A control to render a file upload control.
    
<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/file-upload-expense.png)

### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/file_upload_rendered.png)
<!-- tabs:end -->


<!-- div:left-panel -->

#### MultiExpenses

- `type = ‘MultiExpenses’`
- Description: List of financial line items. It contain 3 primitive UI elements: an expense type selector, an expense amount input and a currency selector.

<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**
![](https://corticon.github.io/templates/#/form-templates/overview/images/multiexpense%20rule.png)

### **Rendered Rules**
![](https://corticon.github.io/templates/#/form-templates/overview/images/multiexpense%20rendered.png)
<!-- tabs:end -->

<!-- div:left-panel -->

#### MultipleChoicesMultiSelect


- `type = ‘MultipleChoicesMultiSelect’`
- Description: Similar to MultipleChoices, but allows for multiple selected options



<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**

![](https://corticon.github.io/templates/#/form-templates/overview/images/MultipleChoicesMultiSelect_rule.png)



### **Rendered Rules**

![](https://corticon.github.io/templates/#/form-templates/overview/images/MultipleChoicesMultiSelect_rendered.png)

### **Copy these rules**
```hover mouse to copy
UI.containers.uiControls += UIControl.new[type='MultiExpenses', label='Enter all the expenses', id='crtl8_1', fieldName='Step8Field1']
UI.containers.uiControls.option += Option.new[value='hotelCode', displayName='Hotel']
UI.containers.uiControls.option += Option.new[value='carRentalCode', displayName='Car Rental']
UI.containers.uiControls.option += Option.new[value='airfareCode', displayName='Airfare']

UI.nextStageNumber
UI.currentStageDescription = 'This is implemented in Step8.ers' 

```

<!-- tabs:end -->

<!-- div:title-panel -->


### fieldName

<!-- div:left-panel -->


`fieldName = entity_assigned_as_pathToData.attribute`

   Description: The UI control specifies where to store the data in the field UIControl.fieldName. For example, if we want to store the value of a person’s date of birth in a field called dob, within a JSON object called `Person`, we would first need to set (either in this stage or a preceding one) the `UI.pathToData = 'Person'` and then we could define the UI Control’s `fieldName` to be ‘dob’. This would hold the value selected for the dob in the JSON object as follows: 

   `"Person":{
      "dob":"MM/DD/YYYY"
   }`

<!-- div:title-panel -->

### id

<!-- div:left-panel -->

Data Type: _Any unique alphanumeric string_

Description: Unique identifier (within the context of one container) for the UI control.

<!-- div:right-panel -->


Example: `UI.containers.uiControls += UIControl.new [id = 'dietary_restrictions', type = 'MultipleChoices', label =  'Do you have any dietary restrictions?', fieldName = 'has_dietary_restrictions']`

<!-- div:title-panel -->

### dataSource
<!-- div:left-panel -->


Data Type: _URL pointing to JSON formatted data_

Description: Specifies the datasource to populate MultipleChoices dropdown options from. Value field at the JSON endpoint must have the key value, display name must have the value `displayName`. If not the case for either of these, these can be overridden by specifying a child entity `‘DataSourceOptions’`

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/datasource.png)

<!-- div:title-panel -->

### max
<!-- div:left-panel -->


Data Type: _Integer_

Description: Optionally give the rendering component for this UI Control a numeric maximum

<!-- div:title-panel -->

### min
<!-- div:left-panel -->


Data Type: _Integer_

Description: Optionally give the rendering component for this UI Control a minimum numeric value end user can enter

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/min.png)

<!-- div:left-panel -->

### minDT


Data Type: _Date_

Description: Optionally give the rendering component for this UI Control a minimum date value end user can enter

<!-- div:title-panel -->

### maxDT

<!-- div:left-panel -->

Data Type: _Date_

Description: Optionally give the rendering component for this UI Control a maximum date value end user can enter

<!-- div:right-panel -->

[](https://corticon.github.io/templates/#/form-templates/overview/images/maxDt.png)

<!-- div:title-panel -->

###  defaultValue
<!-- div:left-panel -->


Data Type: _Alphanumeric string_

Description: Optionally give the rendering component for this UI Control a placeholder default value

<!-- div:title-panel -->

### multiple

<!-- div:left-panel -->

Data Type: _T/F_

Description: When there could be any number of responses to a prompt, set this to true. The answers are stored in an array pointed as specified by `fieldName` attribute.

<!-- div:title-panel -->

### tooltip
<!-- div:left-panel -->


Data Type: _Alphanumeric string_

Description: Optionally give the rendering component for this UI Control a tooltip to assist end user

<!-- div:title-panel -->

### label

<!-- div:left-panel -->

Data Type: _Alphanumeric string_

Description: Content of the prompt provided by the UI Control

<!-- div:title-panel -->

### rows
<!-- div:left-panel -->


Data Type: _integer_

Description: HTML textarea rows attribute

<!-- div:title-panel -->

### required
<!-- div:left-panel -->


Data Type: _T/F_

Description: Whether the user filling out the form is required to respond to this prompt

<!-- div:title-panel -->

### validationErrorMsg
<!-- div:left-panel -->


Data Type: _Alphanumeric string_

Description: Creates validation message for individual UI Control

<!-- div:title-panel -->

### cols

<!-- div:left-panel -->

Data Type: _integer_

Description: HTML textarea cols attribute

<!-- div:title-panel -->

### value
<!-- div:left-panel -->


Data Type: _Alphanumeric string_

Description: The content of a `ReadOnlyText` UI Control

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/readOnlyText.png)

<!-- div:title-panel -->

###  labelPosition

<!-- div:left-panel -->

Data Type: _‘Above’, ‘Side’_

Description: Optionally instruct the rendering component where to place the `label` for this UI Control

<!-- div:title-panel -->

### sortOptions

<!-- div:left-panel -->

Data Type: _‘A to Z’, ‘Z to A’_

Description: Optionally instruct the rendering component how to sort the list of options applied to this UI Control
<!-- div:title-panel -->

## DataSourceOptions
 `UI.containers.uiControls.dataSourceOptions`
<!-- div:left-panel -->

   When using the MultipleChoices UI Control, the actual choices can be populated from a JSON endpoint or be specified by the rule modeler. For the first option, the rule modeler must specify a URL on the field `UIControl.dataSource`. The default client renderer will look for the options at that endpoint under the `value` and `displayName` field. So if the endpoint looks like this, then you’re good to go:

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/formattedJSON.png)

<!-- div:left-panel -->

  If the JSON data has different keys, such as shown below, the client renderer must be told which field is going to serve as the value field and which as the displayName field—these can be, and often are, the same. These are specified with the DataSourceOptions entity.

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/unformattedJsonEnd.png)


---

<!-- div:title-panel -->


### dataTextField

<!-- div:left-panel -->

Description: Optionally define the key name to use as the display name for this option from dropdown, if its name isn’t `displayName`. Oftentimes this will be the same as the `dataValueField` field.

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/dataTextField.png)

<!-- div:title-panel -->

### dataValueField
<!-- div:left-panel -->


Description: Optionally define the name of the key whose value should be stored should end user select this option from dropdown, if its name isn’t value. Oftentimes this will be the same as the `dataTextField` field.

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/dataValueField.png)

<!-- div:title-panel -->

### pathToOptionsArray

<!-- div:left-panel -->

Description: Optionally define where in a JSON endpoint is the array of options to populate a dropdown list with

<!-- div:right-panel -->
<!-- tabs:start -->

### **Rule Definition**
![](https://corticon.github.io/templates/#/form-templates/overview/images/pathToOptionsArray.png)

### **Copy this rule**
```
data.pathToOptionsArray='$.[?(@.brand== \'' + AutoQuote.vehicle_make + '\' )]'
```
<!-- tabs:end -->

<!-- div:title-panel -->

## Option 
`UI.containers.uiControls.option`

Description: When the rule modeler is defining the list of dropdown options, they can do so with the `Option` entity.

<!-- div:title-panel -->

### displayName

<!-- div:left-panel -->

Description: The displayed option within a multiple-choice dropdown. When selected, it is stored as the corresponding value under the attribute assigned `UIControl.fieldName`

<!-- div:title-panel -->

### value

<!-- div:left-panel -->

Description: The value stored in the `pathToData.fieldName` when user selects corresponding displayName.

<!-- div:right-panel -->

![](https://corticon.github.io/templates/#/form-templates/overview/images/manualOptions.png)


<!-- panels:end -->