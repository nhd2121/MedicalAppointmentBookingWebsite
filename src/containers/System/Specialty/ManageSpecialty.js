import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils } from '../../../utils';
import { FormattedMessage } from "react-intl";
import './ManageSpecialty.scss';
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { createNewSpecialty } from "../../../services/userService";
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialtyId: '',
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: ''
        }
    }

    async componentDidMount() {
        
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language) {
            
        }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = {...this.state};
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html,
        });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSaveSpecialty = async () => {
        let res = await createNewSpecialty(this.state);
        if(res && res.errCode === 0) {
            toast.success("Save successfully")
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            })
        } else {
            toast.error("Cannot save")
        }
    }

    render() {
        return (
           <div className='manage-specialty-container'>
            <div className='ms-title'>
                Quản lí chuyên khoa
            </div>
            <div className='add-new-specialty row'>
                <div className='col-6 form-group'>
                    <label>Tên chuyên khoa</label>
                    <input className='form-control' type='text' value={this.state.name}
                        onChange={(event) => this.handleOnChangeInput(event, 'name')}
                    />
                </div>
                <div className='col-6 form-group'>
                    <label>Ảnh chuyên khoa</label>
                    <input className='form-control-file' type='file'
                        onChange={(event) => this.handleOnChangeImage(event)}
                    />
                </div>
                <div className='col-12'>
                    <MdEditor
                        style={{ height: "300px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.descriptionMarkdown}
                    />
                </div>
                <div className='col-12'>
                    <button className='btn-save-specialty'
                        onClick={() => this.handleSaveSpecialty()}
                    >
                        Save
                    </button>
                </div>
            </div>
           </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
