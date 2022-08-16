import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { emitter } from "../../utils/emitter";

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        password: '',
        firstName: '', 
        lastName: '',
        address: '',
    };

    this.listenToEmitter();
  }

  listenToEmitter() {
    emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
        //reset state
        this.setState({
            email: '',
            password: '',
            firstName: '', 
            lastName: '',
            address: '',
        })
    })
  }
  componentDidMount() {}

  toggle = () => {
    this.props.toggleModalUser();
  };

  handleOnChangeInput = (event, id) => {
    let copyState = {...this.state};
    copyState[id] = event.target.value;
    this.setState({
        ...copyState,
    })
  }

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
    for (let i = 0; i < arrInput.length; i++) {
        if(!this.state[arrInput[i]]) {
            isValid = false;
            alert("Missing Parameters: " + arrInput[i]);
            break;
        }
    }
    return isValid;
  }

  handleAddNewUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid) {
        this.props.createNewUser(this.state);
    }
  }

  render() {
    // console.log(this.props);
    return (
      <Modal
        className="modal-user-container"
        isOpen={this.props.isOpen}
        toggle={() => {
          this.toggle();
        }}
        size="lg"
      >
        <ModalHeader
          toggle={() => {
            this.toggle();
          }}
        >
          Create new user
        </ModalHeader>
        <ModalBody>
          <div class="container">
            <div class="row">
              <form action="" method="">
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="inputEmail4">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      name="email"
                      placeholder="Email"
                      onChange = {(event) => {this.handleOnChangeInput(event, "email")}}
                      value = {this.state.email}
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="inputPassword4">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      name="password"
                      placeholder="Password"
                      onChange = {(event) => {this.handleOnChangeInput(event, "password")}}
                      value = {this.state.password}
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="inputEmail4">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      name="firstName"
                      placeholder="firstName"
                      onChange = {(event) => {this.handleOnChangeInput(event, "firstName")}}
                      value = {this.state.firstName}
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="inputPassword4">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      name="lastName"
                      placeholder="lastName"
                      onChange = {(event) => {this.handleOnChangeInput(event, "lastName")}}
                      value = {this.state.lastName}
                    />
                </div>
                </div>
                <div class="form-group col-md-6">
                  <label for="inputAddress">Address</label>
                  <input
                    type="text"
                    class="form-control"
                    name="address"
                    placeholder="1234 Main St"
                    onChange = {(event) => {this.handleOnChangeInput(event, "address")}}
                    value = {this.state.address}
                  />
                </div>
              </form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="px-3"
            color="primary"
            onClick={() => {
              this.handleAddNewUser();
            }}
          >
            Add
          </Button>
          <Button
            className="px-3"
            color="secondary"
            onClick={() => {
              this.toggle();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
