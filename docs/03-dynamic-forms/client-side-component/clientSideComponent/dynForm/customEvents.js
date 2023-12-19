corticon.util.namespace( "corticon.dynForm" );
(function () {
    corticon.dynForm.customEvents = {
        "BEFORE_START": "beforeStart",
        "AFTER_START": "afterStart",
        "FORM_DONE": "formDone",
        "AFTER_DONE": "afterDone",
        "BACK_AT_FORM_BEGINNING": "backAtFormBeginning",
        "NEW_STEP": "newStep",
        "NEW_FORM_DATA_SAVED": "newFormDataSaved",
        "NEW_DS_EXECUTION": "newDSExecution",
        "BEFORE_DS_EXECUTION": "beforeDSExecution",
        "AFTER_UI_STEP_RENDERED": "afterUIStepRendered",
    }
    corticon.dynForm.addCustomEventHandler = function  ( name, fct ) {
        document.body.addEventListener(name, fct, false);
    }
    corticon.dynForm.raiseEvent = function ( name, data ) {
        const event = new Event(name);
        event.theData = data;
        document.body.dispatchEvent(event);
    }
})();
