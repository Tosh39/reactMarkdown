/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Note = React.createClass({
  loadNoteFromServer: function (){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({subject: data.subject, body: data.body});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function (){
    return {subject: "", body: ""};
  },
  componentDidMount: function (){
    this.loadNoteFromServer();
    // setInterval(this.loadNoteFromServer, this.props.pollInterval);
  },
  handleNoteSubmit: function (note){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: note,
      success: function(data) {
        this.setState({subject: data.subject, body: data.body});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleNoteChange: function (note){
    this.setState({subject: note.subject, body: note.body});
  },
  render: function() {
    return (
      <div className="wrapper">
        <NoteInput subject={this.state.subject} body={this.state.body} onNoteChange={this.handleNoteChange} onNoteSubmit={this.handleNoteSubmit} />
        <NoteDisplay subject={this.state.subject} body={this.state.body} />
      </div>
    );
  }
});
var NoteInput = React.createClass({
  getInitialState: function (){
    return {subject: '', body: ''}
    // return {subject: this.props.subject, body: this.props.body}
  },
  // componentWillReceiveProps: function(updated) {
  //   this.setState({subject: updated.subject, body: updated.body});
  // },
  handleSubjectChange: function (e){
    this.setState({subject: e.target.value});
    this.props.onNoteChange({subject: this.state.subject, body: this.state.body});
  },
  handleBodyChange: function (e){
    this.setState({body: e.target.value});
    this.props.onNoteChange({subject: this.state.subject, body: this.state.body});
  },
  handleSubmit: function (e){
    e.preventDefault();
    var subject = this.state.subject.trim();
    var body = this.state.body.trim();
    this.props.onNoteSubmit({subject: subject, body: body});
  },
  // componentDidMount: function() {
  //   this.setState({subject: this.props.subject, body: this.props.body});
  // },
  
  // TODO Set Initial Value
  render: function (){
    return (
      <div className="input_block">
        <form id="form_block" className="" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Subject"
            value={this.state.subject}
            onChange={this.handleSubjectChange}
          />
          <textarea
            type="text"
            value={this.state.body}
            onChange={this.handleBodyChange}
            rows="30"
          >
          </textarea>
          <input type="submit" value="Save" />
        </form>
      </div>
    );
  }
});
var NoteDisplay = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.body.toString());
    return { __html: rawMarkup };
  },
  render: function (){
    return (
      <div className="display_block">
        <h2 className="display_subject">
          {this.props.subject}
        </h2>
        <div className="display_body" dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});
// TODO create Notelist
// var NoteList = React.createClass({
// });

ReactDOM.render(
  <Note url="/api/notes" pollInterval={1000}/>,
  document.getElementById('content')
);
