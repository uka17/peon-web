module.exports = {
  gridUrl: 'http://localhost:4444/wd/hub',
  sets: {
      desktop: {
          files: 'test-hermion/desktop'
      }
  },

  browsers: {
      chrome: {
          desiredCapabilities: {
              browserName: 'firefox' // this browser should be installed on your OS
          }
      }
  }
};