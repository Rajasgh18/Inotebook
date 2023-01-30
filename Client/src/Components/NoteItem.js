import React, {useContext} from "react";
import noteContext from "../Context/Notes/noteContext";
function NoteItem(props) {
    const {deleteNote} = useContext(noteContext);
    const { title, description, tag, _id} = props.note;
    return (
        <div className="col-md-3 my-3">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    <footer className="blockquote-footer">{tag}</footer>
                    <i className="fa fa-thin fa-trash mx-2" onClick={()=>{deleteNote(_id); props.showAlert("Deleted a Note", "danger")}}></i>
                    <i className="fa fa-duotone fa-edit mx-2" onClick={()=>{props.updateNote(props.note)}}></i>
                </div>
            </div>
        </div>
    );
}
export default NoteItem;