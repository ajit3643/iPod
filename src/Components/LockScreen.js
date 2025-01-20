import React from "react";
import { FaLock } from "react-icons/fa";

// Renderse lockscreen
class LockScreen extends React.Component {
  render() {
    return (
      <div>
        <div className="lock-display">
          <FaLock />
        </div>
        <div className="bottom-div-lock">
          <h3>Press Centre Button to Unlock</h3>
        </div>
      </div>
    );
  }
}

export default LockScreen;
