import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import { emitter } from "../../utils/emitter";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      userEdit: {},
    };
  }

  async componentDidMount() {
    await this.getAllUserFromReact();
  }

  getAllUserFromReact = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUsers: response.users,
      });
    }
  };

  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };

  toggleModalUser = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };

  toggleModalEditUser = () => {
    this.setState({
        isOpenModalEditUser: !this.state.isOpenModalEditUser,
      });
  }

  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        await this.getAllUserFromReact();
        this.setState({
          isOpenModalUser: false,
        });

        emitter.emit('EVENT_CLEAR_MODAL_DATA');
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleDeleteUser = async (user) => {
    try {
        let response = await deleteUserService(user.id); //user == item
        if(response && response.errCode === 0) {
            await this.getAllUserFromReact();
        } else {
            alert(response.errMessage)
        }
    } catch (e) {
        console.log(e)
    }
  }

  handleEditUser = (user) => {
    this.setState({
        isOpenModalEditUser: true,
        userEdit: user,
    });
  }

  doEditUser = async (user) => {
    try {
        let response = await editUserService(user);
        if(response && response.errCode === 0) {
            this.setState({
                isOpenModalEditUser: false,
            });

            await this.getAllUserFromReact()
        } else {
            alert(response.errMessage);
        }
    } catch (e) {
        console.log(e);
    }
  }

  render() {
    let arrUsers = this.state.arrUsers;
    return (
      <div className="users-container">
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleModalUser={this.toggleModalUser}
          createNewUser={this.createNewUser}
        />
        {
            this.state.isOpenModalEditUser && 
            <ModalEditUser
                isOpen={this.state.isOpenModalEditUser}
                toggleModalEditUser={this.toggleModalEditUser}
                currentUser = {this.state.userEdit}
                editUser={this.doEditUser}
            />
        }
        
        <div className="title text-center">Manage user</div>
        <div className="mx-1">
          <button
            className="btn btn-primary px-3"
            onClick={() => this.handleAddNewUser()}
          >
            <i className="fas fa-plus"></i>
            Add new user
          </button>
        </div>
        <div className="users-table mt-3 mx-2">
          <table id="customers">
            <tbody>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
              {arrUsers &&
                arrUsers.map((item, index) => {
                  return (
                    <>
                      <tr key={index}>
                        <td>{item.email}</td>
                        <td>{item.lastName}</td>
                        <td>{item.firstName}</td>
                        <td>{item.address}</td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => {
                              this.handleEditUser(item);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              this.handleDeleteUser(item);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
