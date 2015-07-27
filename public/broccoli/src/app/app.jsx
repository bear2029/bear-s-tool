var React = require('react');
var Indicator = require('./components/Indicator.react');
var Editor = require('./components/Editor.react');

React.render(<Indicator />,document.getElementById('indicator-mountpoint'));
React.render(<Editor />,document.getElementById('editor-mountpoint'));
