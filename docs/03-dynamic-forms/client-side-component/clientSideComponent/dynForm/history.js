corticon.util.namespace( "corticon.dynForm" );

corticon.dynForm.History = function () {
    let itsHistory = [];

    function setupHistory() {
        corticon.dynForm.addCustomEventHandler( corticon.dynForm.customEvents.AFTER_UI_STEP_RENDERED, storeDecisionServiceInputs2);
    }

    function storeDecisionServiceInputs2 ( event ) {
        const theData = event.theData;
        const input = JSON.parse(JSON.stringify(theData.input));
        const stage = theData.stage;
        if ( stage === 0 )
            itsHistory = [];

        const index = itsHistory.length;
        itsHistory[index] = { "input": input, "stage": stage };
    }

    function isHistoryEmpty() {
        return itsHistory.length <= 1;
    }

    function getPreviousStageData() {

        let currentStage;
        if ( itsHistory.length === 1 )
            currentStage = itsHistory[0];
        else
            currentStage = itsHistory.pop();

        if ( currentStage === undefined ) {
            console.log('Internal error in history.getPreviousStageData: there should be a current stage');
            return;
        }

        const prevStage = itsHistory.pop();
        if ( prevStage === undefined ) {
            console.log('error in history.getPreviousStageData: there should be a previous stage');
            return;
        }

        return prevStage;
    }

    function getRestartHistory () {
        return JSON.stringify(itsHistory);
    }

    function setRestartHistory (savedHistory) {
        itsHistory = JSON.parse(savedHistory);
    }

    return {
        setupHistory: setupHistory,
        getRestartHistory: getRestartHistory,
        setRestartHistory: setRestartHistory,
        getPreviousStageData: getPreviousStageData,
        isHistoryEmpty: isHistoryEmpty
    }
}
