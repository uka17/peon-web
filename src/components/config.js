module.exports = {
  tableDateTimeFormat: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'    
  },
  apiUrl: 'http://localhost:8080/v1.0',
  onStepResultRef: {
    'gotoNextStep': 'Go to next step',
    'quitWithSuccess': 'Quiit with success',
    'quitWithFailure': 'Quit with failure',
    'gotoStep': { 'Go to step': 1 }
  }
};