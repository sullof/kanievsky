

export default class LeftMenu extends React.Component {
  render() {
    return (
      <div defaultActiveKey="/home" className="flex-column">
        <div href="/home">Active</div>
        <div eventKey="link-1">Link</div>
        <div eventKey="link-2">Link</div>
        <div eventKey="disabled" disabled>
          Disabled
        </div>
      </div>
    )
  }
}
