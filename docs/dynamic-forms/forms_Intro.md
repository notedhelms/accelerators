---
id: forms_Intro
title: Dynamic Forms with Corticon.js
tags:
  - Corticon.js
  - Dynamic Forms
---

# Dynamic Forms with Corticon.js

Creating a dynamic form can be a slog even when you know what you're doing. It's time consuming, repetitive, and frankly runs the risk of transforming front end developers into Jack Torrance from _The Shining:_

![The Shining all work and no play screenshot](images/shining.jpg)

But with Corticon.js, dynamic forms can be created in a fraction of the time, with substantial contributions from non-developers, and through a framework-agnostic design pattern that maximizes the reusability of form logic.

## What we mean by dynamic forms:

It's common to fill out forms and most frameworks can easily handle simple forms, but dynamic forms are more challenging to create and maintain. The complexity in those two directions could be exacerbated when there is a use case with hundreds of fields and questions that should be entered by the users. This could be especially difficult for customers that need to deal with a vast number of rules that change over time. This leads to many possible paths for the end user to take (e.g., filling out an insurance claim).

One of the biggest challenges is how to manage those rules and systematize them into a single system and test those paths in a robust way without putting in manual labor. Another related problem is how those rules are defined (via descriptive language, UI, etc.) and whether a businessperson can write them down without having any technical experience.

The last element of the array of problems is how to visualize all those rules on the frontend as a form without asking your developers to have domain knowledge of your business processes, and of course, how to maintain any changes without taking days for implementation and regression testing.

## Dynamic Forms with Corticon.js

Dynamic Forms are just one use case for Corticon.js. The dynamic form solution is architected around having a model/view, where:

- The model is generated from the rules system.
- A generic UI component capable of rendering the instructions from the model is acting as the view. The component can be hosted in any Web app or in mobile apps.

In a nutshell, Corticon.js provides a model-driven interactive development interface called Corticon.js Studio within which users define business rules that will change input data based upon specified conditions.

Traditionally, you might think a rules engine is just used to automate a decision based upon data that is _already_ known and available; for example, calculating a loan rate based upon the data known about an applicant.

But in this case, we're going to be _gathering_ data from the end user filling out the form, dynamically presenting additional user prompts which are conditioned on previous answers. Think of this design pattern as the cold metal body of a robot and the 'brain' which gives it instructions on what to do, when, how, and based on what conditions.

Rule modelers (who could be developers or could be business analysts who aren't coders but are comfortable in Excel) use Corticon.js Studio to build the brain of the robot. OK, less a brain than a JavaScript file.

Front end developers will handle its body, starting from an open source form rendering template. Rules are defined in Corticon.js which specify what prompts to present to the user, the input type for responding to the prompt, in what order to present the prompts, constraints/validations on the entered data, how the previous responses may or may not impact subsequent prompts, and when the requisite data has been gathered and is ready to be passed along to downstream systems. While this logic is all defined in Corticon.js Studio, it will ultimately be transformed (or, technically, _transpiled_) into a Decision Service JavaScript bundle.

The front end rendering component in turn will be responsible for the styling of the forms' user interface and prompts, invoking the decision service when the user hits 'next', and rendering the components of the form that the decision service specifies, along with any constraints and validations it specifies.

For example, consider an insurance quoting form. An optimal dynamic form for the quoting process should:

- Guide the end user through the quoting process in the most efficient way possible—not wasting the end users' time with inapplicable inquiries such as 'Please Select a Vehicle Make (if applicable)' for a renter's insurance policy, or ask for the applicant's home address if we already know that they're an existing customer and thus we know this information already.
- Not risk the end user abandoning the quoting process by making calls to a server every time something _dynamic_ must happen.
- At each juncture where the form determines what information is needed, evaluate the accrued user provided data, data already known about the user (e.g. via them being logged in and their info populated from a CRM), or data retrieved live from external endpoints
- Maintain form rendering logic (rendering component only knows that when it is told to render a multi select dropdown UI component, it will look and behave like this) as a separate but interoperable component from the content of the prompt/responses itself (decision service logic doesn't care how the multi select dropdown looks or behave, but the content of the prompt should be X, the options should be populated from the array Y, and the selection of the end user's selected value should be captured in the browser session storage under fieldname Z.

To get you started building forms, we provide a form accelerator template which is made up of:

- A base Corticon.js Rule Vocabulary comprised of the UI definition components that are able to render by the rendering HTML out of the box
- A 'test driver' html page which allows form developers to test the form as they go and see how the different components work together
- JS files which serve as the glue between the Decision Service file and the front end HTML. These will be preconfigured to 'translate' the terminology used in the rule vocabulary to specify UI components into the actual HTML input types etc.

## Defining Form Behavioral Logic in Corticon.js Studio

Corticon Studio is a standalone desktop environment to model, analyze, test, and save business rules as executable decision services. Corticon 'rule modelers' are commonly business analysts with expertise in the business domain and its policies, using Corticon Studio to define, author, analyze and test rules.

Once satisfied, rules are then deployed as Decision Services onto Corticon Server or as serverless functions with Corticon.js.

This tutorial is focused on skills related to building dynamic forms with Corticon.js. If you're unfamiliar with Corticon but only interested in the dynamic forms use case, below is a brief overview of the core components involved in modeling Corticon business rules. These are just as important to know when building dynamic forms to gather form response data as they are for automating decisions based upon that data.

There are four main steps of building rules in Corticon Studio, culminating in the RuleFlow which will be deployed as a Decision Service.

1. The first step of the rule modeling process with Corticon is to build the 'dictionary' of business terms used throughout the rules, the  **Rule Vocabulary**.
2. **Rulesheets**  are like Decision Tables. Users 'model' the business rules by defining actions to take when specific conditions are met.
3. Once the rules created in the rulesheet are satisfied, the first  **Ruletest**  in Corticon Studio can be created to run test data through the rules in the test server embedded in the local application.
4. From here, you can continue adding more rules to the rulesheet, or more commonly, compartmentalize our rules into different rulesheets, and create a  **Ruleflow**  to specify the sequence from one rulesheet to another. When multiple Rulesheets are included in a Ruleflow, the Rulesheets will execute in a sequence determined by their Rulesheet order in the Ruleflow.

### Building the Rule Vocabulary

We can use Corticon.js Studio to model business rules to define both the dynamic form's behavior and the rules related to the operational decision being made based upon the collected data.

First, we define a unified data model—the Rule Vocabulary—that captures:

- The user interface (UI), such as which questions to pose to the end user at what stage in the form being filled, and what type of input should be allowed for these questions
- The data needed for the actual decision at hand, which will be captured as a form response and sent along to a downstream application, decision service or system of record

When working with this model in Corticon.js Studio, it is referred to as a Rule Vocabulary, but once we compile the rules into a JavaScript file, the Rule Vocabulary is translated into the JSON schema used to communicate between the front-end rendering component and the embedded business rules.

#### Out of the Box UI Rule Vocabulary as JSON Schema

```
{
    "type": "object",
    "properties": {
        "currentStageNumber": {
            "type": "integer",
            "description": "Where to specify: Filter panel of rulesheet, in advanced view\n\nDescription: When the client side rendering component is ready for the next step in the flow, it invokes the decision service by setting UI.currentStageNumber to UI.nextStageNumber in the input payload of the decision service."
        },
        "labelPosition": {
            "type": "string",
            "description": "Sets the default label position - Can be overidden on a control by control basis"
        },
        "stageOnExit": {
            "type": "integer",
            "description": "To invoke a subflow we need to specify the entry stage via nextStageNumber and where we will resume via stageOnExit"
        },
        "pathToData": {
            "type": "string",
            "description": "We define which data we want to store by specifying in the initial stage of the rules which vocabulary entity should ‘store’ the data accrued throughout the form. This is specified with UI.pathToData in an initial stage. The pathToData entity will be at index 1 in the JSON. The stored data can then be passed along to other workflow steps once the form is complete, or used to define a conditional rule at a later stage in the form.\nData Type: Any alphanumeric string will be accepted, but in order to use user-selected responses to dynamically change form behavior in future steps, this should be set to an entity in the vocabulary that will accrue the data"
        },
        "language": {
            "type": "string",
            "description": "On start, the rendered can accept the language from the UI but a decision service may switch the language based on some rules"
        },
        "containers": {
            "type": "object",
            "description": "For all steps in which something is being presented to the user (versus just a calculation/decision made in the background), the decision service will specify  the list of UI controls to render from the decision service JSON payload at the UI.containers element. This is an array of all the containers to render for this stage. The container can be viewed as a panel containing various labels and input fields decision service. The container has various attributes, for example a title.",
            "properties": {
                "validationMsg": {
                    "type": "string",
                    "description": "Creates a container wide validation message"
                },
                "description": {
                    "type": "string",
                    "description": "An optional string that doesn't impact behavior of the form. It is mostly useful for troubleshooting. "
                },
                "id": {
                    "type": "string",
                    "description": "Required if any container is being rendered."
                },
                "uiControls": {
                    "type": "object",
                    "description": "Each UI control element has multiple attributes. The most important one is the 'type' attribute as it allows the CSC to know what kind of control to render and which necessary attributes to access based on the type.",
                    "properties": {
                        "fieldName": {
                            "type": "string",
                            "description": " The UI control specifies where to store the data in the field UIControl.fieldName."
                        },
                        "dataSourceOptions": {
                            "type": "object",
                            "description": "When using the MultipleChoices UI Control, the actual choices can be populated from a JSON endpoint or be specified by the rule modeler. For the first option, the rule modeler must specify a URL on the field UIControl.dataSource. The default client renderer will look for the options at that endpoint under the value and displayName field. If the JSON data has different keys, such as shown below, the client renderer must be told which field is going to serve as the value field and which as the displayName field—these can be, and often are, the same. These are specified with the DataSourceOptions entity.",
                            "properties": {
                                "dataTextField": {
                                    "type": "string",
                                    "description": "Optionally define the key name to use as the display name for this option from dropdown, if its name isn’t displayName. Oftentimes this will be the same as the dataValueField field."
                                },
                                "dataValueField": {
                                    "type": "string",
                                    "description": "Optionally define the name of the key whose value should be stored should end user select this option from dropdown, if its name isn’t value. Oftentimes this will be the same as the dataTextField field."
                                },
                                "pathToOptionsArray": {
                                    "type": "string",
                                    "description": "Optionally define where in a JSON endpoint is the array of options to populate a dropdown list with "
                                }
                            },
                            "required": [
                                "dataTextField",
                                "dataValueField"
                            ]
                        },
                        "max": {
                            "type": "integer",
                            "description": "Optionally give the rendering component for this UI Control a numeric maximum"
                        },
                        "defaultValue": {
                            "type": "string",
                            "description": "Optionally give the rendering component for this UI Control a placeholder default value"
                        },
                        "multiple": {
                            "type": "boolean",
                            "description": "Description: When there could be any number of responses to a prompt, set this to true. The answers are stored in an array pointed as specified by fieldName attribute"
                        },
                        "tooltip": {
                            "type": "string",
                            "description": "Optionally give the rendering component for this UI Control a tooltip to assist end user"
                        },
                        "label": {
                            "type": "string",
                            "description": "Content of the prompt provided by the UI Control"
                        },
                        "rows": {
                            "type": "integer",
                            "description": "Description: HTML textarea rows attribute"
                        },
                        "type": {
                            "type": "string",
                            "enum": [
                                "Text",
                                "SingleChoice",
                                "MultipleChoices",
                                "DateTime",
                                "Number",
                                "ReadOnlyText",
                                "YesNo",
                                "TextArea",
                                "FileUpload",
                                "MultiExpenses",
                                "MultipleChoicesMultiSelect",
                                "YesNoBoolean"
                            ]
                        },
                        "required": {
                            "type": "boolean",
                            "description": "Optionally tell the rendering component that this UI Control must be answered by the end user"
                        },
                        "min": {
                            "type": "number",
                            "description": "Optionally give the rendering component for this UI Control a minimum numeric value end user can enter"
                        },
                        "minDT": {
                            "type": "string",
                            "description": "Optionally give the rendering component for this UI Control a minimum date value end user can enter",
                            "format": "date"
                        },
                        "labelPosition": {
                            "type": "string",
                            "description": "Optionally instruct the rendering component where to place the label for this UI Control "
                        },
                        "sortOptions": {
                            "description": "Optionally instruct the rendering component how to sort the list of options applied to this UI Control ",
                            "enum": [
                                "'A to Z'",
                                "'Z to A'"
                            ]
                        },
                        "maxDT": {
                            "type": "string",
                            "description": "Optionally give the rendering component for this UI Control a maximum date value end user can enter",
                            "format": "date"
                        },
                        "validationErrorMsg": {
                            "type": "string",
                            "description": "Creates validation message for individual UI Control"
                        },
                        "id": {
                            "type": "string",
                            "description": "Data Type: Any unique alphanumeric string\n\nDescription: Unique identifier (within the context of one container) for the UI control."
                        },
                        "cols": {
                            "type": "integer",
                            "description": "Description: HTML textarea cols attribute"
                        },
                        "dataSource": {
                            "type": "string",
                            "description": "Specifies the datasource to populate MultipleChoices dropdown options from. Value field at the JSON endpoint must have the key value, display name must have the value displayName. If not the case for either of these, these can be overridden by specifying a child entity ‘DataSourceOptions’",
                            "format": "uri-template"
                        },
                        "value": {
                            "type": "string",
                            "description": "The content of a ReadOnlyText UI Control"
                        },
                        "option": {
                            "type": "object",
                            "description": "Use in conjunction with MultipleChoices UI Control to populate the list of options. Alternative is to specify an endpoint for the UI Control's datasource to retrieve data from. ",
                            "properties": {
                                "displayName": {
                                    "type": "string",
                                    "description": "What the particular dropdown option's dispay name should be"
                                },
                                "value": {
                                    "type": "string",
                                    "description": "What the particular dropdown option's value will be stored as should it be selected"
                                }
                            }
                        }
                    },
                    "required": [
                        "label",
                        "type",
                        "id"
                    ]
                },
                "title": {
                    "type": "string",
                    "description": "Renders the h3 header on Container entity"
                }
            },
            "required": [
                "id",
                "title"
            ]
        },
        "done": {
            "type": "boolean",
            "description": "Upon receiving a done instruction from the decision service (a notification of the end of the flow) via UI.done=T, it is expected the collected data will be passed to another function or process; typically an event will be raised with a pointer to the JSON data collected during the flow. "
        },
        "nextStageNumber": {
            "type": "integer",
            "description": "Description: The decision service sets the attribute UI.nextStageNumber to specify the next step in the flow, unless it is the last stage, in which case this field is left null and done is set to ‘true’\n\nWhere to specify: Action row of rulesheet"
        },
        "currentStageDescription": {
            "type": "string"
        }
    },
    "required": [
        "currentStageNumber"
    ]
}
```

## Testing Form with the Test Driver Renderer

When we build the dynamic form rules, we're ultimately going to be transpiling the rules into a self-contained JavaScript bundle. In simpler terms, all of the logic will be encapsulated into just one file decisionServiceBundle.js.

Front end developers handle the 'rendering side' of the form. This includes defining data that will be passed in at the onset of the form, styling, and where the data goes once the form is filled out.

To make everyone's life easier, we provide open source implementations of Corticon.js Dynamic Forms which you can freely download, import into your environment, and adapt to your needs. This includes both sample rule assets that you can work with in Corticon.js Studio, and a sample client side rendering component.