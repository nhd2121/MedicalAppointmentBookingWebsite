import React, { Component } from 'react';
import { connect } from "react-redux";
import "./BillModal.scss";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import {toast} from "react-toastify";
import moment from 'moment';
import { CommonUtils } from '../../../utils';

class BillModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: ''
        }
    }

    async componentDidMount() {
        if(this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language) {
            
        }

        if(prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
              imgBase64: base64,
            });
        }
    };

    handleSendBill = () => {
        this.props.sendBill(this.state);
    }
        

    render() {
        let { isOpenModal, closeBillModal, sendBill } = this.props;
        return (
            <Modal 
                isOpen={isOpenModal} 
                // className={'sending-bill-modal-container'}
                size='md'
                centered
            >
                <div className='modal-header'>
                    <h5 className='modal-title'>Send Bill</h5>
                    <button type='button' className='close' aria-label='close' onClick={closeBillModal}>
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                                <label>Email</label>
                                <input 
                                    className='form-control' 
                                    type='email' 
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeEmail(event)}
                                />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-6 form-group'>
                                <label>Select file</label>
                                <input 
                                    className='form-control-file' 
                                    type='file' 
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSendBill()}>Send</Button>
                    <Button color="primary"  onClick={closeBillModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillModal);
