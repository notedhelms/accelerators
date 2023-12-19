corticon.util.namespace( "corticon.dynForm" );

corticon.dynForm.StepsController = function () {
    let itsDecisionServiceInput = [{},{}];
    let itsPathToData;
    let itsFormData;
    let itsFlagAllDone;
    let itsLabelPositionAtUILevel;
    let itsQuestionnaireName;
    let itsInitialLanguage;
    let itsFlagRenderWithKui;

    const itsHistory = new corticon.dynForm.History();
    const itsUIControlsRenderer = new corticon.dynForm.UIControlsRenderer();

    async function startDynUI( baseDynamicUIEl, decisionServiceEngine, externalData, language, questionnaireName, useKui ) {
        itsFlagRenderWithKui = useKui;
        itsQuestionnaireName = questionnaireName;
        itsInitialLanguage = language;
        itsHistory.setupHistory();

        const restartData = getRestartData (questionnaireName);
        if ( restartData === null ) {
            setStateForStartFromBeginning(language, externalData);
        }
        else {
            const dialog = confirm("Do you want to start from where you left last time?");
            if (dialog) {
                setStateFromRestartData(questionnaireName, restartData);
            }
            else {
                clearRestartData(questionnaireName);
                setStateForStartFromBeginning(language, externalData);
            }
        }

        corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.BEFORE_START);

        await _askDecisionServiceForNextUIElementsAndRender( decisionServiceEngine, itsDecisionServiceInput, baseDynamicUIEl );

        corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.AFTER_START, { historyEmpty: itsHistory.isHistoryEmpty() });
    }

    function setStateForStartFromBeginning(language, externalData) {
        _resetDecisionServiceInput(language);

        itsFormData = null;
        itsFlagAllDone = false;
        itsPathToData = null;
        itsLabelPositionAtUILevel = "Above";

        itsDecisionServiceInput[1] = JSON.parse(JSON.stringify(externalData));
    }

    function setStateFromRestartData(questionnaireName, restartData) {
        itsLabelPositionAtUILevel = "Above";
        itsPathToData = getPathToData(questionnaireName);
        setStateFromStepData(restartData);
        itsHistory.setRestartHistory(getRestartHistory(questionnaireName));
        itsHistory.getPreviousStageData();
    }

    function getRestartHistory(decisionServiceName) {
        return window.localStorage.getItem('CorticonRestartHistory_'+decisionServiceName);
    }

    function setStateFromStepData(data) {
        itsDecisionServiceInput = data;
        itsFormData = itsDecisionServiceInput[1];
    }

    async function processPrevStep(baseDynamicUIEl, decisionServiceEngine, language) {
        if ( itsFlagAllDone )
            return;

        const allData = itsHistory.getPreviousStageData();
        if ( allData === undefined )
            return;

        const prevStageNbr = allData['stage'];
        itsDecisionServiceInput = allData['input'];
        itsDecisionServiceInput[0].nextStageNumber = prevStageNbr;
        await processNextStep(baseDynamicUIEl, decisionServiceEngine, language, false);

        if ( prevStageNbr === 0 )
            corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.BACK_AT_FORM_BEGINNING);
    }

    async function processNextStep(baseDynamicUIEl, decisionServiceEngine, language, saveInputToFormData=true) {
        if ( saveInputToFormData ) {
            _saveEnteredInputsToFormData(baseDynamicUIEl);
        }

        corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.NEW_STEP);

        if ( itsFlagAllDone ) {
            clearRestartData(itsQuestionnaireName);
            corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.AFTER_DONE);
        }
        else {
            _preparePayloadForNextStage (itsDecisionServiceInput[0].nextStageNumber);
            const restartData = JSON.stringify(itsDecisionServiceInput);
            let nextUI = await _askDecisionServiceForNextUIElementsAndRender ( decisionServiceEngine, itsDecisionServiceInput, baseDynamicUIEl );
            while ( nextUI.noUiToRenderContinue !== undefined && nextUI.noUiToRenderContinue ) {
                _preparePayloadForNextStage (nextUI.nextStageNumber);
                nextUI = await _askDecisionServiceForNextUIElementsAndRender( decisionServiceEngine, itsDecisionServiceInput, baseDynamicUIEl );
                corticon.dynForm.raiseEvent( corticon.dynForm.customEvents.NEW_FORM_DATA_SAVED, itsFormData );
                if ( nextUI.done )
                    break;
            }

            saveRestartData(itsQuestionnaireName, restartData);

            if ( nextUI.done ) {
                itsFlagAllDone = nextUI.done;
                corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.FORM_DONE);
            }
        }
    }

    function clearRestartData( decisionServiceName ) {
        window.localStorage.removeItem('CorticonRestartPayload_'+decisionServiceName);
        window.localStorage.removeItem('CorticonRestartPathToData_'+decisionServiceName);
        window.localStorage.removeItem('CorticonRestartHistory_'+decisionServiceName);
    }

    function saveRestartData( decisionServiceName, payload ) {
        try {
            window.localStorage.setItem('CorticonRestartPayload_'+decisionServiceName, payload);
            window.localStorage.setItem('CorticonRestartPathToData_'+decisionServiceName, itsPathToData);
            window.localStorage.setItem('CorticonRestartHistory_'+decisionServiceName, itsHistory.getRestartHistory());
        } catch (e) {
        }
    }

    function getRestartData(decisionServiceName) {
        const payload = window.localStorage.getItem('CorticonRestartPayload_'+decisionServiceName);
        if ( payload !== null )
            return JSON.parse(payload);
        else
            return null;
    }

    function getPathToData(decisionServiceName) {
        return window.localStorage.getItem('CorticonRestartPathToData_'+decisionServiceName);
    }

    function _resetDecisionServiceInput(language) {
        _preparePayloadForNextStage( 0, language );

        for (const property in itsDecisionServiceInput[1])
            delete itsDecisionServiceInput[1][property];
    }

    function _preparePayloadForNextStage( nextStage, language ) {
        const nextPayload = {};
        const stateProperties = ['stageOnExit', 'language', 'labelPosition', 'pathToData'];
        for ( let i=0; i<stateProperties.length; i++ ) {
            const prop = stateProperties[i];
            if ( itsDecisionServiceInput[0][prop] !== undefined )
                nextPayload[prop] = itsDecisionServiceInput[0][prop];
        }

        nextPayload.currentStageNumber = nextStage;

        if ( language !== undefined ) {
            nextPayload['language'] = language;
        }

        itsDecisionServiceInput[0] = nextPayload;
    }

    function _processLabelPositionSetting ( newLabelPosition ) {
        if ( newLabelPosition !== undefined && newLabelPosition !== null)
            itsLabelPositionAtUILevel = newLabelPosition;
    }

    async function _askDecisionServiceForNextUIElementsAndRender ( decisionServiceEngine, payload, baseEl ) {
        const result = await _runDecisionService( decisionServiceEngine, payload );
        if ( result.corticon.status !== 'success' )
            return;

        const nextUI = result.payload[0];

        if ( nextUI.pathToData !== undefined && nextUI.pathToData !== null && nextUI.pathToData.length !== 0 )
            itsPathToData = nextUI.pathToData;

        _processLabelPositionSetting ( nextUI.labelPosition );

        itsFormData = itsDecisionServiceInput[1];

        if ( nextUI.noUiToRenderContinue !== undefined && nextUI.noUiToRenderContinue )
            return nextUI;

        const containers = nextUI.containers;
        if ( containers === undefined ) {
            alert('Error: missing container');
            return nextUI;
        }

        itsUIControlsRenderer.renderUI ( containers, baseEl, itsLabelPositionAtUILevel, nextUI.language, itsFlagRenderWithKui );

        const event = { "input": payload, "stage": payload[0].currentStageNumber };
        corticon.dynForm.raiseEvent( corticon.dynForm.customEvents.AFTER_UI_STEP_RENDERED,event);

        return nextUI;
    }

    function _saveOneFormData(formDataFieldName, val) {
        if ( val === undefined )
            return;

        if (itsPathToData === undefined || itsPathToData === null)
            itsFormData[formDataFieldName] = val;
        else {
            if (itsFormData[itsPathToData] === undefined)
                itsFormData[itsPathToData] = {};

            itsFormData[itsPathToData][formDataFieldName] = val;
        }
    }

    function _saveNonArrayInputsToFormData(baseEl) {
        let allFormEls = baseEl.find('.nonarrayTypeControl :input').not(':checkbox').not('.markerFileUploadExpense');
        allFormEls.each(function (index, item) {
            const oneInputEl = $(item);
            const formDataFieldName = oneInputEl.data("fieldName");
            const val = oneInputEl.val();
            const type = oneInputEl.data("type");
            if (type !== undefined && type !== null && type === "decimal") {
                const converted = Number(val);
                if (isNaN(converted))
                    alert("you didn't enter a number in the field");
                else
                    _saveOneFormData(formDataFieldName, converted);
            }
            else {
                if ( val !== undefined && val !== null && val !== "" )
                    _saveOneFormData(formDataFieldName, val);
            }
        });

        allFormEls = baseEl.find('.nonarrayTypeControl :checkbox');
        allFormEls.each(function (index, item) {
            const oneInputEl = $(item);
            const formDataFieldName = oneInputEl.data("fieldName");
            const val = oneInputEl.is(':checked');
            _saveOneFormData(formDataFieldName, val);
        });

        _saveFileUploadExpenses(baseEl);
    }

    function _saveFileUploadExpenses(baseEl) {
        let allFormEls = baseEl.find('.nonarrayTypeControl .markerFileUploadExpense');

        allFormEls.each(function (index, item) {
            const oneInputEl = $(item);
            const formDataFieldName = oneInputEl.data("fieldName");
            const id = oneInputEl.attr('id')
            const val = oneInputEl.val();
            _saveOneFileUploadExpenseData(formDataFieldName, val, id);
        });

    }

    function _saveOneFileUploadExpenseData(formDataFieldName, val, id) {
        if ( val === undefined )
            return;

        let theExpenses;
        if (itsPathToData === undefined || itsPathToData === null)
            theExpenses = itsFormData[formDataFieldName];
        else {
            if (itsFormData[itsPathToData] === undefined) {
                alert('Error: There should already be form data');
                return;
            }
            else
                theExpenses = itsFormData[itsPathToData][formDataFieldName];
        }

        for ( let i=0; i<theExpenses.length; i++ ) {
            const oneExpense = theExpenses[i];
            if ( oneExpense.id === id )
                oneExpense['fileUpload'] = val;
        }
    }

    function _saveEnteredInputsToFormData (baseEl) {
        _saveNonArrayInputsToFormData(baseEl);
        _saveArrayTypeInputsToFormData(baseEl);
        corticon.dynForm.raiseEvent( corticon.dynForm.customEvents.NEW_FORM_DATA_SAVED, itsFormData );
    }

    function _saveArrayTypeInputsToFormData (baseEl) {
        _processAllSimpleArrayControls(baseEl);
        _processAllComplexArrayControls(baseEl);
    }

    function _processAllComplexArrayControls (baseEl) {
        let outerArray = [];
        let formDataFieldName;
        let uiControlType;

        let allArrayEls = baseEl.find('.complexArrayTypeControl');
        allArrayEls.each(function(index,item){
            const oneArrayEl = $(item);
            uiControlType = oneArrayEl.data("uicontroltype");
            let allFormEls = oneArrayEl.find(':input').not(':checkbox');

            let innerArray = [];
            for ( var i=0; i<allFormEls.length; i++ ) {
                const oneFormEl = allFormEls[i];
                const oneInputEl = $(oneFormEl);
                formDataFieldName = oneInputEl.data("fieldName");
                const val = oneInputEl.val();
                innerArray.push( val );
            }

            outerArray.push(innerArray);
        });

        if ( outerArray.length !== 0 ) {
            if ( uiControlType === 'MultiExpenses' ) {
                const expenseFieldArray = ['expenseCode', 'amount', 'currency' ];
                const convertedArray = _createEachExpenseEntity(outerArray, expenseFieldArray);
                _saveArrayElFormData(formDataFieldName, convertedArray);
            }
            else
                alert('This complex array type is not yet supported ' + uiControlType );
        }
    }

    function _processAllSimpleArrayControls(baseEl) {
        const allSimpleUiControlsOfArrayType = _getAllSimpleArrayTypeInputsToFormData(baseEl);

        for (let j = 0; j < allSimpleUiControlsOfArrayType.length; j++) {
            const oneControlData = allSimpleUiControlsOfArrayType[j];
            const uiControlType = oneControlData['type'];
            const formDataFieldName = oneControlData['fieldName'];
            const valuesForOneControl = oneControlData['values'];
            if (uiControlType === 'Text' || uiControlType === 'Number' || uiControlType === 'DateTime' ) {
                const convertedArray = _createEachItemEntity(valuesForOneControl, uiControlType);
                _saveArrayElFormData(formDataFieldName, convertedArray);
            } else
                alert('This simple array type is not yet supported ' + uiControlType);
        }
    }

    function _getAllSimpleArrayTypeInputsToFormData(baseEl) {
        let allUiControlsOfArrayType = [];

        let allArrayEls = baseEl.find('.simpleArrayTypeControl');
        allArrayEls.each(function(index,item){
            let formDataFieldName;
            const oneArrayEl = $(item);
            const uiControlType = oneArrayEl.data("uicontroltype");
            const allFormEls = oneArrayEl.find(':input').not(':checkbox');

            let allValuesForOneControl = [];
            for ( let i=0; i<allFormEls.length; i++ ) {
                const oneFormEl = allFormEls[i];
                const oneInputEl = $(oneFormEl);
                formDataFieldName = oneInputEl.data("fieldName");
                const val = oneInputEl.val();
                allValuesForOneControl.push( val );
            }

            const allDataForOneControl = {};
            allDataForOneControl['fieldName'] = formDataFieldName;
            allDataForOneControl['type'] = uiControlType;
            allDataForOneControl['values'] = allValuesForOneControl;

            allUiControlsOfArrayType.push(allDataForOneControl);
        });

        return allUiControlsOfArrayType;
    }

    function _createEachItemEntity(valuesForOneControl, uiControlType) {
        const convertedArray = [];
        let fieldName;
        if (uiControlType === 'Text' )
            fieldName = 'itemText';
        else if ( uiControlType === 'Number' )
            fieldName = 'itemNumber';
        else if ( uiControlType === 'DateTime' )
            fieldName = 'itemDateTime';
        else {
            alert('This uicontrol type for simple array type is not yet supported ' + uiControlType);
            return convertedArray;
        }

        for ( let i=0; i<valuesForOneControl.length; i++ ) {
            const val = valuesForOneControl[i];
            if ( val !== undefined && val !== null && val !== "" ) {
                const oneItemAsObjLit = {};
                oneItemAsObjLit[fieldName] = val;
                convertedArray.push( oneItemAsObjLit );
            }
        }
        return convertedArray;
    }

    function _createEachExpenseEntity(outerArray, expenseFieldArray) {
        const convertedArray = [];
        for ( let i=0; i<outerArray.length; i++ ) {
            const oneItemAsAnArray = outerArray[i];
            const oneItemAsObjLit = {};
            for ( let j=0; j<oneItemAsAnArray.length; j++ ) {
                oneItemAsObjLit[expenseFieldArray[j]] = oneItemAsAnArray[j];
            }
            const converted = Number(oneItemAsObjLit['amount']);
            if ( $.isNumeric(converted) )
                oneItemAsObjLit['amount'] = converted;
            else
                oneItemAsObjLit['amount'] = 0;

            oneItemAsObjLit['id'] = '' + i;

            convertedArray.push( oneItemAsObjLit );
        }
        return convertedArray;
    }

    function _saveArrayElFormData(formDataFieldName, outerArray) {
        if ( outerArray === undefined )
            return;

        if (itsPathToData === undefined || itsPathToData === null)
            itsFormData[formDataFieldName] = outerArray;
        else {
            if (itsFormData[itsPathToData] === undefined)
                itsFormData[itsPathToData] = {};

            itsFormData[itsPathToData][formDataFieldName] = outerArray;
        }
    }

    async function _runDecisionService(decisionServiceEngine, payload ) {
        try {
            const event = { "input": payload, "stage": payload[0].currentStageNumber };
            corticon.dynForm.raiseEvent( corticon.dynForm.customEvents.BEFORE_DS_EXECUTION,event);

            const configuration = { logLevel: 0 };
            const t1 = performance.now();
            const result = await decisionServiceEngine.execute(payload, configuration);
            const t2 = performance.now();
            const event2 = { "output": result,
                "execTimeMs": t2-t1,
                "stage": payload[0].currentStageNumber
            };

            if(result.corticon !== undefined) {
                if ( result.corticon.status === 'success' ) {
                    const newStepUI = result.payload[0];
                    if ( newStepUI.currentStageDescription !== undefined && newStepUI.currentStageDescription !== null )
                        event2["stageDescription"] = newStepUI.currentStageDescription;
                }
                else
                    alert('There was an error executing the rules.\n' + JSON.stringify(result, null, 2));

                corticon.dynForm.raiseEvent( corticon.dynForm.customEvents.NEW_DS_EXECUTION, event2 );
                return result;
            }
            else
                alert('There was an error executing the rules.\n' + JSON.stringify(result, null, 2));
        }
        catch ( e ) {
            alert('There was an exception executing the rules ' + e);
        }
    }

    return {
        startDynUI: startDynUI,
        processNextStep: processNextStep,
        processPrevStep: processPrevStep
    }
}
